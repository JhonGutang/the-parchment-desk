import { useState } from "react";
import { trpc } from "../trpc";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";
import CodeVerifier from "@/components/CodeVerifier";

export default function Auth() {
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Send code to user's email
  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await trpc.sendVerificationCode.mutate({ email });
      setStep("code");
    } catch (err: any) {
      setError(err.message || "Failed to send code. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[repeating-linear-gradient(135deg,#e1dbc0_0px,#efe7d1_2px,#f8f5ea_2px,#f8f5ea_15px)] font-serif">
      <Card className="relative w-full max-w-md border-[2.5px] border-[#e2d3c3] rounded-xl md:p-8 p-4 bg-[#fff8ef] shadow-[0_3px_22px_0_rgba(56,35,11,0.07)]">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-0">
          {/* Heading & Intro */}
          <header className="w-full flex flex-col items-center text-center space-y-0">
            <span className="tracking-widest text-xs text-[#8d7955] mt-1">
              EST. 1892 • WIZARDING EDITION
            </span>
            <h1
              className="font-black text-3xl md:text-4xl mt-1 pb-2 leading-tight"
              style={{ fontFamily: "UnifrakturCook,EB Garamond,serif", color: "#36312b", textShadow: "0 1px 0 #e0d6bc" }}
            >
              The Parchment Desk
            </h1>
            <span className="italic text-xs mb-3 text-[#bb9d7b]">
              “All the News There Is to Enchant”
            </span>
          </header>

          <section className="mb-4">
            <div className="font-semibold text-base md:text-lg text-[#76604a] tracking-wide uppercase">
              Subscriber Portal
            </div>
            <div className="text-xs mt-1 mb-2 text-[#bba178] font-serif">
              Present your credentials to proceed
            </div>
          </section>

          {/* Steps */}
          {step === "email" && (
            <form onSubmit={handleSendCode} className="w-full">
              <Button
                variant="outline"
                className="w-full border-[#dfcbad] bg-[#eee6d4] text-[#6c5435] font-semibold py-2 mb-1 flex gap-3 items-center justify-center rounded-sm hover:bg-[#f5ede3] cursor-not-allowed opacity-90 shadow-sm"
                disabled
                type="button"
              >
                <svg width="22" height="22" className="inline-block">
                  <image href="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" width="22" height="22" />
                </svg>
                Continue with Google
              </Button>
              <div className="my-2 flex items-center">
                <div className="flex-1 border-t border-[#e2d3c3]" />
                <span className="mx-2 text-xs text-[#b79d76] font-serif">OR</span>
                <div className="flex-1 border-t border-[#e2d3c3]" />
              </div>
              <label
                htmlFor="email-auth"
                className="text-[0.95em] mb-1 text-[#8d7955] font-serif"
              >
                Electronic Post Address
              </label>
              <div className="relative my-1">
                <Input
                  id="email-auth"
                  type="email"
                  placeholder="your.name@correspondence.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="pl-10 pr-2 py-2 font-mono bg-[#fafaff] border-[#decab3] focus:border-[#bca36e] tracking-tight text-sm placeholder:italic placeholder:text-[#bca36e]/70"
                  autoComplete="username"
                  disabled={isLoading}
                />
                <Mail
                  className="absolute left-2 top-2.5 text-[#bba178] w-5 h-5"
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#635146] hover:bg-[#8d7955] font-bold text-[#fff8ef] py-2 mt-2 rounded-sm border border-[#bc9f74] shadow-sm text-base tracking-wide disabled:opacity-80"
              >
                {isLoading ? "Issuing parchment..." : "PROCEED TO CHRONICLE"}
              </Button>
              {error && (
                <div className="text-red-600 mt-2 text-center font-serif text-xs">
                  {error}
                </div>
              )}
            </form>
          )}

          {/* CODE STEP */}
          {step === "code" && (
            <CodeVerifier
              email={email}
              onSuccess={() => setStep("success")}
              onBack={() => {
                setStep("email");
                setError(null);
              }}
            />
          )}

          {/* SUCCESS STEP */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-2 mt-6 mb-8 px-4">
              <CheckCircle className="text-green-700 mb-1" size={32} aria-hidden="true" />
              <div className="text-green-700 font-serif text-lg text-center">
                Access granted! <br />
                See you in the headlines.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
