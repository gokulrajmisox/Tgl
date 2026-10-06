"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { updatePasswordAction } from "@/lib/auth/actions";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { EASE } from "@/components/motion/motion";
import { PasswordInput } from "@/components/ui/Input";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/feedback/Toaster";

type State = "checking" | "ready" | "expired" | "done";

export function ResetPasswordForm({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [state, setState] = useState<State>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  // A valid recovery session must exist; otherwise the link expired.
  useEffect(() => {
    if (disabled) {
      setState("expired");
      return;
    }
    getSupabaseBrowserClient()
      .auth.getSession()
      .then(({ data }) => setState(data.session ? "ready" : "expired"));
  }, [disabled]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setFieldErrors({});
    setFormError(null);
    const result = await updatePasswordAction({ password, confirmPassword });
    setLoading(false);
    if (!result.ok) {
      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.error ?? null);
      if (result.error) {
        setShakeKey((k) => k + 1);
        toast({ title: result.error, tone: "error" });
      }
      return;
    }
    setState("done");
    toast({ title: result.message ?? "Your password has been updated.", tone: "success" });
  }

  if (state === "checking") {
    return (
      <div className="space-y-4" aria-label="Loading">
        <div className="skeleton h-8 w-2/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-11 w-full" />
        <div className="skeleton h-11 w-full" />
      </div>
    );
  }

  if (state === "expired") {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
        <h1 className="text-[26px] font-semibold tracking-tight text-charcoal">This link has expired</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-charcoal-500">
          Password reset links are single-use and expire quickly. Request a new one to continue.
        </p>
        <div className="mt-6">
          <Button fullWidth onClick={() => router.push("/forgot-password")}>
            Request a new link
          </Button>
        </div>
      </motion.div>
    );
  }

  if (state === "done") {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
          <motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden
            initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <path d="M5 12.5 10 17.5 19 7" stroke="#20C982" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>
        <h1 className="text-[26px] font-semibold tracking-tight text-charcoal">Password updated</h1>
        <p className="mt-2 text-[15px] text-charcoal-500">You can now sign in with your new password.</p>
        <div className="mt-6">
          <Button fullWidth onClick={() => router.push("/login")}>Sign in</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[26px] font-semibold tracking-tight text-charcoal">Choose a new password</h1>
        <p className="mt-1.5 text-[15px] text-charcoal-500">Make it at least 8 characters long.</p>
      </div>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div>
          <PasswordInput label="New password" autoComplete="new-password" value={password}
            onChange={(e) => setPassword(e.target.value)} error={fieldErrors.password} shakeKey={shakeKey} required />
          <PasswordStrength password={password} />
        </div>
        <PasswordInput label="Confirm new password" autoComplete="new-password" value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} error={fieldErrors.confirmPassword} shakeKey={shakeKey} required />
        {formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}
        <Button type="submit" loading={loading} fullWidth size="lg">
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
      <p className="mt-7 text-center text-sm text-charcoal-500">
        <Link href="/login" className="font-medium text-forest hover:text-forest-700">Back to sign in</Link>
      </p>
    </div>
  );
}
