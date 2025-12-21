import { helloWorld } from "./procedures/helloWorld";
import { sendVerificationCode } from "./procedures/sendEmailVerification";
import { verifyCode } from "./procedures/verifyCode";
import { t } from "./instance";

export const appRouter = t.router({
  helloWorld,
  sendVerificationCode,
  verifyCode
});

export type AppRouter = typeof appRouter;
