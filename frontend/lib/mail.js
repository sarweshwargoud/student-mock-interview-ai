import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a welcome email to newly registered users via Resend.
 *
 * @param {Object} params
 * @param {string} params.toEmail - Recipient email address.
 * @param {string} [params.userName] - Recipient user display name.
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function sendWelcomeEmail({ toEmail, userName }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Resend] RESEND_API_KEY is not configured in environment variables.');
    return { success: false, error: 'RESEND_API_KEY is not configured.' };
  }

  if (!toEmail) {
    console.warn('[Resend] No recipient email address provided.');
    return { success: false, error: 'Recipient email is required.' };
  }

  const displayName = userName?.trim() || 'there';

  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'Interview Guru <onboarding@resend.dev>';

    const data = await resend.emails.send({
      from: fromAddress,
      to: [toEmail],
      subject: 'Welcome to Interview Guru! 🚀',
      text: `Hi ${displayName},

Welcome to Interview Guru! 🎉

Thanks for registering and giving Interview Guru a try.

Interview Guru is an AI-powered mock interview platform where you can enter a role and tech stack or upload your resume, practice interview questions, and receive AI-generated feedback and scores.

The goal is simple — practice more, understand where you can improve, and gradually build confidence for real interviews.

You can now start your first mock interview and see how you perform.

Good luck with your interview preparation! 🚀

— Interview Guru Team`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Interview Guru</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 32px 32px 16px 32px; text-align: center; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);">
                      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                        🤖 Interview Guru
                      </h1>
                      <p style="margin: 6px 0 0 0; color: #a5b4fc; font-size: 13px; font-weight: 500;">
                        AI-Powered Mock Interview Platform
                      </p>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 32px; font-size: 15px; line-height: 1.6; color: #334155;">
                      <p style="margin: 0 0 16px 0;">Hi <strong>${displayName}</strong>,</p>

                      <p style="margin: 0 0 16px 0;">
                        Welcome to <strong>Interview Guru</strong>! 🎉
                      </p>

                      <p style="margin: 0 0 16px 0;">
                        Thanks for registering and giving Interview Guru a try.
                      </p>

                      <p style="margin: 0 0 20px 0;">
                        Interview Guru is an AI-powered mock interview platform where you can enter a role and tech stack or upload your resume, practice interview questions, and receive AI-generated feedback and scores.
                      </p>

                      <div style="margin: 0 0 20px 0; background-color: #f1f5f9; padding: 16px 20px; border-left: 4px solid #4f46e5; border-radius: 6px;">
                        <p style="margin: 0; color: #1e293b; font-size: 14.5px;">
                          The goal is simple — <strong>practice more, understand where you can improve, and gradually build confidence for real interviews.</strong>
                        </p>
                      </div>

                      <p style="margin: 0 0 20px 0;">
                        You can now start your first mock interview and see how you perform.
                      </p>

                      <p style="margin: 0 0 28px 0;">
                        Good luck with your interview preparation! 🚀
                      </p>

                      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; color: #475569; font-weight: 600;">
                        — Interview Guru Team
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 16px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
                      © ${new Date().getFullYear()} Interview Guru. All rights reserved.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log(`[Resend] Welcome email sent successfully to ${toEmail} (ID: ${data?.data?.id || data?.id})`);
    return { success: true, data };
  } catch (error) {
    console.error(`[Resend] Failed to send welcome email to ${toEmail}:`, error?.message || error);
    return { success: false, error: error?.message || String(error) };
  }
}