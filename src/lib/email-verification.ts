/**
 * Professional email verification service.
 * Primary: Abstract Email Verification API (https://abstractapi.com/email-validation)
 * Fallback: SMTP-level mailbox check via RCPT TO
 *
 * To use: set ABSTRACT_EMAIL_API_KEY in your .env.local
 * Get a free key at: https://app.abstractapi.com/api-explorer/email-validation
 *
 * If no API key is configured, falls back to SMTP verification only.
 */

import dns from "dns";
import net from "net";
import { promisify } from "util";

const resolveMx = promisify(dns.resolveMx);

// ---------- Types ----------

export interface EmailVerificationResult {
  /** Whether the email is considered deliverable */
  deliverable: boolean;
  /** Overall quality score 0-1 */
  qualityScore: number;
  /** Whether the domain is a known disposable provider */
  isDisposable: boolean;
  /** Whether the domain is catch-all (accepts all emails) */
  isCatchAll: boolean;
  /** Whether the mailbox exists */
  mailboxExists: boolean | null;
  /** Human-readable result message */
  message: string;
  /** Provider used for verification */
  provider: string;
  /** Raw quality for UI color coding */
  quality: "high" | "medium" | "low" | "invalid";
}

// ---------- Disposable domains blocklist ----------

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "tempmail.com",
  "throwaway.email", "temp-mail.org", "fakeinbox.com", "sharklasers.com",
  "guerrillamailblock.com", "grr.la", "dispostable.com", "yopmail.com",
  "yopmail.fr", "trashmail.com", "trashmail.net", "trashmail.me",
  "maildrop.cc", "mailsac.com", "mailnesia.com", "discard.email",
  "discardmail.com", "discardmail.de", "mailexpire.com", "mailnull.com",
  "tmpmail.net", "tmpmail.org", "10minutemail.com", "10minutemail.co.za",
  "tempinbox.com", "tempinbox.co.uk", "getairmail.com", "mohmal.com",
  "harakirimail.com", "tmail.ws", "tmail.org", "tmpmail2.com",
  "emailondeck.com", "33mail.com", "mytemp.email", "emailfake.com",
  "tempail.com", "temp-email.io", "tempemail.co.za", "burnermail.io",
  "getnada.com", "emailnator.com",
]);

// ---------- Abstract API verification ----------

async function verifyWithAbstractApi(email: string): Promise<EmailVerificationResult | null> {
  const apiKey = process.env.ABSTRACT_EMAIL_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`,
      { method: "GET", signal: AbortSignal.timeout(15000) }
    );

    if (!response.ok) {
      console.error("Abstract API error:", response.status);
      return null;
    }

    const data = await response.json();

    // Map Abstract API response to our result format
    const deliverability = data.deliverability?.toUpperCase();
    const qualityScore = data.quality_score ?? 0;
    const isSmtpValid = data.is_smtp_valid?.value ?? false;
    const isMxValid = data.is_mx_found?.value ?? false;
    const isDisposableType = data.is_disposable_email?.value ?? false;
    const isCatchAll = data.is_catchall_email?.value ?? false;
    const isFree = data.is_free_email?.value ?? false;

    let quality: EmailVerificationResult["quality"] = "invalid";
    if (deliverability === "DELIVERABLE" && qualityScore >= 0.7) {
      quality = "high";
    } else if (deliverability === "DELIVERABLE" || (isSmtpValid && qualityScore >= 0.4)) {
      quality = "medium";
    } else if (deliverability === "RISKY" || qualityScore >= 0.2) {
      quality = "low";
    } else {
      quality = "invalid";
    }

    const deliverable =
      deliverability === "DELIVERABLE" ||
      (isSmtpValid && isMxValid && qualityScore >= 0.5 && !isDisposableType);

    let message = "";
    if (!isMxValid) {
      message = "Email domain cannot receive emails.";
    } else if (isDisposableType) {
      message = "Disposable or temporary email addresses are not accepted.";
    } else if (!isSmtpValid && deliverability !== "DELIVERABLE") {
      message = "This email address could not be verified. Please enter a real email you can access.";
    } else if (deliverable) {
      message = "Email verified successfully.";
    } else {
      message = "We could not verify this mailbox. Please enter a real email address that can receive emails.";
    }

    return {
      deliverable,
      qualityScore,
      isDisposable: isDisposableType,
      isCatchAll,
      mailboxExists: isSmtpValid,
      message,
      provider: "abstract-api",
      quality,
    };
  } catch (error) {
    console.error("Abstract API verification failed:", error);
    return null;
  }
}

// ---------- SMTP fallback verification ----------

function verifyMailboxViaSmtp(email: string, mxHost: string): Promise<boolean | null> {
  return new Promise((resolve) => {
    const socket = net.createConnection(25, mxHost);
    let step = 0;
    let output = "";
    const timeout = setTimeout(() => { socket.destroy(); resolve(null); }, 10000);

    const finish = (result: boolean | null) => {
      clearTimeout(timeout);
      try { socket.write("QUIT\r\n"); socket.destroy(); } catch {}
      resolve(result);
    };

    socket.on("data", (data) => {
      output += data.toString();

      if (step === 0) {
        if (output.match(/^220/)) { step = 1; socket.write(`EHLO beyundlabs.com\r\n`); }
        else finish(null);
        return;
      }
      if (step === 1) {
        const lines = output.split("\r\n");
        const lastLine = lines[lines.length - 1];
        if (lastLine.match(/^250[ -]/)) { step = 2; socket.write(`MAIL FROM:<verify@beyundlabs.com>\r\n`); }
        return;
      }
      if (step === 2) {
        if (output.match(/250\s/)) { step = 3; socket.write(`RCPT TO:<${email}>\r\n`); }
        else finish(null);
        return;
      }
      if (step === 3) {
        const lines = output.split("\r\n");
        const lastResponse = lines[lines.length - 1];
        if (lastResponse.match(/^25[0-9]/)) finish(true);
        else if (lastResponse.match(/^5[0-9]{2}/)) finish(false);
        else finish(null);
        return;
      }
    });

    socket.on("error", () => finish(null));
    socket.on("timeout", () => { socket.destroy(); finish(null); });
  });
}

async function verifyWithSmtpFallback(email: string): Promise<EmailVerificationResult> {
  const domain = email.split("@")[1];

  // Check disposable
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      deliverable: false, qualityScore: 0, isDisposable: true, isCatchAll: false,
      mailboxExists: false,
      message: "Disposable or temporary email addresses are not accepted.",
      provider: "smtp-fallback", quality: "invalid",
    };
  }

  // Check domain exists
  try {
    await new Promise<void>((resolve, reject) => {
      dns.resolve(domain, (err) => (err ? reject(err) : resolve()));
    });
  } catch {
    return {
      deliverable: false, qualityScore: 0, isDisposable: false, isCatchAll: false,
      mailboxExists: false,
      message: "This email domain does not exist. Please check for typos.",
      provider: "smtp-fallback", quality: "invalid",
    };
  }

  // Check MX records
  let mxRecords;
  try {
    mxRecords = await resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return {
        deliverable: false, qualityScore: 0, isDisposable: false, isCatchAll: false,
        mailboxExists: false,
        message: "This email domain cannot receive emails.",
        provider: "smtp-fallback", quality: "invalid",
      };
    }
  } catch {
    return {
      deliverable: false, qualityScore: 0, isDisposable: false, isCatchAll: false,
      mailboxExists: false,
      message: "Could not verify email domain.",
      provider: "smtp-fallback", quality: "invalid",
    };
  }

  // SMTP RCPT TO check
  const sorted = mxRecords.sort((a, b) => a.priority - b.priority);
  const primaryMx = sorted[0].exchange;

  try {
    const mailboxExists = await verifyMailboxViaSmtp(email, primaryMx);

    if (mailboxExists === true) {
      return {
        deliverable: true, qualityScore: 0.7, isDisposable: false, isCatchAll: false,
        mailboxExists: true,
        message: "Email verified successfully.",
        provider: "smtp-fallback", quality: "medium",
      };
    } else if (mailboxExists === false) {
      return {
        deliverable: false, qualityScore: 0.1, isDisposable: false, isCatchAll: false,
        mailboxExists: false,
        message: "This email address does not exist. Please enter a real email you can access.",
        provider: "smtp-fallback", quality: "invalid",
      };
    } else {
      // Inconclusive (catch-all server or timeout)
      return {
        deliverable: true, qualityScore: 0.5, isDisposable: false, isCatchAll: true,
        mailboxExists: null,
        message: "Email verified (catch-all domain).",
        provider: "smtp-fallback", quality: "medium",
      };
    }
  } catch {
    return {
      deliverable: true, qualityScore: 0.5, isDisposable: false, isCatchAll: false,
      mailboxExists: null,
      message: "Email verification inconclusive.",
      provider: "smtp-fallback", quality: "medium",
    };
  }
}

// ---------- Main export ----------

/**
 * Verify an email address using professional verification.
 * Tries Abstract API first, falls back to SMTP verification.
 */
export async function verifyEmail(email: string): Promise<EmailVerificationResult> {
  // 1. Try Abstract API
  const abstractResult = await verifyWithAbstractApi(email);
  if (abstractResult) return abstractResult;

  // 2. Fallback to SMTP
  return verifyWithSmtpFallback(email);
}