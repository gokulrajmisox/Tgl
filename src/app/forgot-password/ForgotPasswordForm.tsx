"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { requestPasswordResetAction } from "@/lib/auth/actions";
import { EASE } from "@/components/motion/motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/feedback/Toaster";

export function ForgotPasswordForm({ disabled }: { disabled?: boolean }) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (disabled || loading) return;
    setLoading(true);
    setError(null);
    const result = await requestPasswordResetAction(email);
    setLoading(false);
    if (!result.ok) {
      setError(result.fieldErrors?.email ?? result.error ?? "Enter a valid email address.");
      setShakeKey((k) => k + 1);
      return;
    }
    setSent(true);
    toast({ title: result.message ?? "Reset instructions sent.", tone: "success" });
  }

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 7h16v10H4z M4 7l8 6 8-6" stroke="#20C982" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-[26px] font-semibold tracking-tight text-charcoal">Check your email</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-charcoal-500">
          If an account matches that email, you&apos;ll receive reset instructions shortly.
        </p>
        <div className="mt-6 space-y-3">
          <Button variant="secondary" fullWidth onClick={() => setSent(false)}>
            Try a different email
          </Button>
          <Link href="/login" className="block text-center text-sm font-medium text-forest hover:text-forest-700">
            Back to sign in
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <fieldset disabled={disabled} className="disabled:opacity-60">
      <div className="mb-8">
        <h1 className="text-[26px] font-semibold tracking-tight text-charcoal">Forgot password?</h1>
        <p className="mt-1.5 text-[15px] text-charcoal-500">
          Enter your email and we&apos;ll send you reset instructions.
        </p>
      </div>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Input label="Email address" type="email" autoComplete="email" placeholder="you@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)} error={error ?? undefined} shakeKey={shakeKey} required />
        <Button type="submit" loading={loading} fullWidth size="lg">
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>
      <p className="mt-7 text-center text-sm text-charcoal-500">
        <Link href="/login" className="font-medium text-forest hover:text-forest-700">Back to sign in</Link>
      </p>
    </fieldset>
  );
}
