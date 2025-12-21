import { useState } from "react";
import { trpc } from "../trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BadgeHelp } from "lucide-react";

interface CodeVerifierProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function CodeVerifier({ email, onSuccess, onBack }: CodeVerifierProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await trpc.verifyCode.mutate({ email, code });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Invalid or expired code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerifyCode} className="w-full">
      <div className="flex flex-col items-center text-center my-2 gap-1">
        <BadgeHelp className="text-[#bba178] mb-1" size={28} aria-hidden="true" />
        <span className="font-serif text-[#4b3927] text-base">
          A code has been sent to your owl-registered email.
        </span>
        <span className="font-serif text-xs text-[#a89274]">
          Enter it below to open the Chronicle
        </span>
      </div>
      <Input
        type="text"
        inputMode="numeric"
        maxLength={8}
        autoFocus
        placeholder="MAGIC-CODE"
        value={code}
        onChange={e => setCode(e.target.value)}
        required
        className="w-full tracking-widest text-center text-lg font-mono py-2 my-1 rounded-sm border border-[#e2d3c3] bg-[#fafaff] focus:border-[#bca36e] text-[#635146] placeholder:italic placeholder:text-[#bca36e]/70"
        disabled={isLoading}
      />
      <Button
        type="submit"
        disabled={isLoading || !code.trim()}
        className="w-full bg-[#635146] hover:bg-[#8d7955] font-bold text-[#fff8ef] py-2 mt-2 rounded-sm border border-[#bc9f74] shadow-sm text-base tracking-wide disabled:opacity-80"
      >
        {isLoading ? "Checking spells..." : "PROCEED TO CHRONICLE"}
      </Button>
      {error && (
        <div className="text-red-600 mt-2 text-center font-serif text-xs">
          {error}
        </div>
      )}
      <Button
        type="button"
        variant="link"
        className="block mx-auto mt-2 text-[#7f633d] text-xs underline font-serif hover:text-[#635146]"
        onClick={onBack}
        disabled={isLoading}
      >
        ← Try another address
      </Button>
    </form>
  );
}
