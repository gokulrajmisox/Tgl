"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { resendVerificationAction } from "@/lib/auth/actions";
import { EASE } from "@/components/motion/motion";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/feedback/Toaster";

export function VerifyEmailPanel({
  email,
  disabled,
}: {
  email?: string;
  disabled?: boolean;
}) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  async function resend() {
    if (disabled || loading || cooldown > 0 || !email) return;
    setLoading(true);
    const result = await resendVerificationAction(email);
    setLoading(false);
    if (!result.ok) {
      toast({ title: result.error ?? "Couldn't resend the email.", tone: "error" });
      return;
    }
    toast({ title: result.message ?? "Verification email sent.", tone: "success" });
    setCooldown(60);
    const timer = window.setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) window.clearInterval(timer);
        return Math.max(0, c - 1);
      });
    }, 1000);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 7h16v10H4z M4 7l8 6 8-6" stroke="#20C982" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="text-[26px] font-semibold tracking-tight text-charcoal">
        Verify your email
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-charcoal-500">
        {email ? (
          <>We sent a verification link to <span className="font-medium text-charcoal">{email}</span>. Click it to activate your account.</>
        ) : (
          "We sent you a verification link. Click it to activate your account."
        )}
      </p>
      <ul className="mt-5 space-y-2 text-sm text-charcoal-500">
        <li>· The link expires after a while — request a new one if needed.</li>
        <li>· Check your spam folder if you don&apos;t see it.</li>
      </ul>
      <div className="mt-6 space-y-3">
        <Button
          variant="secondary"
          fullWidth
          loading={loading}
          disabled={!email || cooldown > 0}
          onClick={resend}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification email"}
        </Button>
        <Link href="/login" className="block text-center text-sm font-medium text-forest hover:text-forest-700">
          Back to sign in
        </Link>
      </div>
    </motion.div>
  );
}
