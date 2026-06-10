import { NextRequest, NextResponse } from "next/server";
import { verifyEmail } from "@/server/services/email-verification.service";

/**
 * POST /api/verify-email
 * Professional email verification endpoint.
 * Used by the Contact form's onBlur handler to verify emails in real-time.
 *
 * Request body: { email: string }
 * Response: { valid: boolean, message: string, quality: string, qualityScore: number, ... }
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Basic format check before expensive verification
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({
        valid: false,
        message: "Please enter a valid email address format.",
        quality: "invalid",
        qualityScore: 0,
        provider: "format-check",
      });
    }

    // Run professional verification (Abstract API → SMTP fallback)
    const result = await verifyEmail(trimmedEmail);

    return NextResponse.json({
      valid: result.deliverable,
      message: result.message,
      quality: result.quality,
      qualityScore: result.qualityScore,
      isDisposable: result.isDisposable,
      isCatchAll: result.isCatchAll,
      mailboxExists: result.mailboxExists,
      provider: result.provider,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      {
        valid: false,
        error: "Verification service temporarily unavailable. Please try again.",
        quality: "invalid",
        qualityScore: 0,
      },
      { status: 500 }
    );
  }
}