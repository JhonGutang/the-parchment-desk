import { z } from "zod";

export const sendVerificationEmailSchema = z.object({
  email: z.email(),
});