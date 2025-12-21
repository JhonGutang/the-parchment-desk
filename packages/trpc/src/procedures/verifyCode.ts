import { t } from "../instance";
import { z } from "zod";
import { codeStore } from "./sendEmailVerification";

async function verifyCodeForEmail(email: string, code: string): Promise<boolean> {
  const record = codeStore[email];
  if (!record) return false;

  if (Date.now() > record.expiresAt) {
    delete codeStore[email];
    return false;
  }

  if (record.code !== code) return false;

  delete codeStore[email];
  return true;
}

export const verifyCode = t.procedure
  .input(
    z.object({
      email: z.string().email(),
      code: z.string().min(1),
    })
  )
  .mutation(async ({ input }) => {
    const isValid = await verifyCodeForEmail(input.email, input.code);
    if (!isValid) {
      throw new Error("Invalid or expired code.");
    }
    return { success: true };
  });
