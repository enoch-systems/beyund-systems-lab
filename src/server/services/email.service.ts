import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const FROM_EMAIL = "Beyund Labs Academy <noreply@techtailblazeracademy.site>";

/**
 * Email #1: Welcome — Application Received
 */
export async function sendApplicationReceivedEmail(params: {
  to: string;
  fullName: string;
  course: string;
}) {
  if (!resend) {
    throw new Error("Resend not configured. Set RESEND_API_KEY in .env.local");
  }

  const whatsappNumber = "+2349162919586";
  const accountNumber = "5400920494";
  const bankName = "Moniepoint Nigeria";

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: `Welcome to ${params.course} — Beyund Labs Academy`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #0d9488; margin: 0;">
            🎉 Welcome, ${params.fullName}!
          </h1>
          <p style="font-size: 14px; color: #64748b; margin: 8px 0 0;">
            Your application for <strong>${params.course}</strong> has been received.
          </p>
        </div>
        <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="font-size: 16px; font-weight: 600; color: #1e293b; margin: 0 0 12px;">📋 Next Steps</h2>
          <ol style="padding-left: 20px; margin: 0;">
            <li style="font-size: 13px; color: #475569; margin-bottom: 8px;"><strong>Make Payment</strong> — Transfer the course fee to the account below</li>
            <li style="font-size: 13px; color: #475569; margin-bottom: 8px;"><strong>Send Payment Proof</strong> — Forward your receipt to our admin on WhatsApp</li>
            <li style="font-size: 13px; color: #475569;"><strong>Get Enrolled</strong> — Once confirmed, you'll receive your login credentials</li>
          </ol>
        </div>
        <div style="background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h3 style="font-size: 14px; font-weight: 600; color: #0f766e; margin: 0 0 10px;">💰 Payment Details</h3>
          <table style="width: 100%; font-size: 13px;">
            <tr><td style="color: #64748b; padding: 3px 0;">Account Number:</td><td style="font-weight: 700; color: #1e293b; text-align: right;">${accountNumber}</td></tr>
            <tr><td style="color: #64748b; padding: 3px 0;">Bank:</td><td style="font-weight: 700; color: #1e293b; text-align: right;">${bankName}</td></tr>
          </table>
        </div>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 20px; text-align: center;">
          <h3 style="font-size: 14px; font-weight: 600; color: #15803d; margin: 0 0 8px;">📱 Send Payment Proof on WhatsApp</h3>
          <p style="font-size: 12px; color: #475569; margin: 0 0 10px;">After payment, send your receipt to:</p>
          <a href="https://wa.me/${whatsappNumber.replace("+", "")}" style="display: inline-block; background: #25D366; color: #fff; text-decoration: none; padding: 10px 24px; border-radius: 6px; font-weight: 600; font-size: 13px;">💬 Chat Admin on WhatsApp</a>
          <p style="font-size: 11px; color: #64748b; margin: 8px 0 0;">Admin: ${whatsappNumber}</p>
        </div>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  console.log(`📧 Welcome email sent to ${params.to}`);
}

/**
 * Email #2: Enrollment Confirmed
 */
export async function sendEnrollmentConfirmedEmail(params: {
  to: string;
  fullName: string;
  course: string;
  defaultPin: string;
  portalUrl: string;
}) {
  if (!resend) {
    throw new Error("Resend not configured. Set RESEND_API_KEY in .env.local");
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: `✅ Enrolled! Access Your ${params.course} Dashboard — Beyund Labs Academy`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-size: 22px; font-weight: 700; color: #0d9488; margin: 0;">Payment Confirmed! 🎉</h1>
          <p style="font-size: 14px; color: #64748b; margin: 8px 0 0;">You're now fully enrolled in <strong>${params.course}</strong></p>
        </div>
        <div style="background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="font-size: 16px; font-weight: 600; color: #0f766e; margin: 0 0 14px;">🔐 Your Login Credentials</h2>
          <table style="width: 100%; font-size: 13px;">
            <tr><td style="color: #64748b; padding: 6px 0;">Email:</td><td style="font-weight: 600; color: #1e293b; text-align: right;">${params.to}</td></tr>
            <tr><td style="color: #64748b; padding: 6px 0;">Default PIN:</td><td style="font-weight: 700; color: #0d9488; text-align: right; font-size: 18px; letter-spacing: 4px;">${params.defaultPin}</td></tr>
          </table>
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
          <a href="${params.portalUrl}/students-portal/login" style="display: inline-block; background: #0d9488; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600; font-size: 14px;">🚀 Access Your Dashboard</a>
        </div>
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px;">
          <h3 style="font-size: 13px; font-weight: 600; color: #92400e; margin: 0 0 6px;">⚡ Change Your PIN</h3>
          <p style="font-size: 12px; color: #475569; margin: 0;">Use the "Forgot PIN?" link on the login page to reset it.</p>
        </div>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  console.log(`📧 Enrollment email sent to ${params.to}`);
}