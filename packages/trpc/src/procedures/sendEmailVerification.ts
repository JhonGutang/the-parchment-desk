import { t } from "../instance";
import { z } from "zod";
import { transporter } from "../utils/mailer";

// In-memory store for verification codes
const codeStore: Record<string, { code: string; expiresAt: number }> = {};

// Generate a 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store code in memory
function storeCode(email: string, code: string, expiresInMs = 10 * 60 * 1000) {
  codeStore[email] = {
    code,
    expiresAt: Date.now() + expiresInMs,
  };
}

// TRPC procedure to send verification code
export const sendVerificationCode = t.procedure
  .input(z.object({ email: z.string().email() }))
  .mutation(async ({ input }) => {
    const { email } = input;

    const code = generateVerificationCode();
    storeCode(email, code);

    await transporter.sendMail({
      from: `"My App" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: "Your verification code",
      html: `
        <p>Your verification code is:</p>
        <h2>${code}</h2>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    return { success: true };
  });

// Export the in-memory store so verify file can use it
export { codeStore };
