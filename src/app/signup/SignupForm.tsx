"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signUpAction, getGoogleOAuthUrl } from "@/lib/auth/actions";
import { isGoogleOAuthEnabled } from "@/lib/auth/config";
import { safeNext } from "@/lib/url";
import { EASE } from "@/components/motion/motion";
import { Input, PasswordInput, Checkbox } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/brand";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useToast } from "@/components/feedback/Toaster";

const STEPS = ["Personal", "Security", "Finish"] as const;

type Fields = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
  terms: boolean;
};

export function SignupForm({ next, disabled }: { next?: string; disabled?: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [fields, setFields] = useState<Fields>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    terms: false,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [done, setDone] = useState<{ email: string; needsVerification: boolean } | null>(null);

  const set = (k: keyof Fields) => (v: string | boolean) =>
    setFields((f) => ({ ...f, [k]: v }));

  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (fields.fullName.trim().length < 2) errs.fullName = "Enter your full name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))
        errs.email = "Enter a valid email address.";
    }
    if (s === 1) {
      if (fields.password.length < 8) errs.password = "Use at least 8 characters.";
      if (fields.confirmPassword !== fields.password)
        errs.confirmPassword = "Passwords don't match.";
    }
    if (s === 2) {
      if (!fields.terms) errs.terms = "Please accept the Terms and Privacy Policy.";
    }
    setFieldErrors(errs);
    if (Object.keys(errs).length) setShakeKey((k) => k + 1);
    return Object.keys(errs).length === 0;
  }

  function go(delta: 1 | -1) {
    if (delta === 1 && !validateStep(step)) return;
    setDirection(delta);
    setStep((s) => s + delta);
    setFieldErrors({});
    setFormError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (disabled || loading) return;
    if (!validateStep(2)) return;
    setLoading(true);
    setFormError(null);

    const result = await signUpAction({
      fullName: fields.fullName.trim(),
      email: fields.email.trim(),
      password: fields.password,
      confirmPassword: fields.confirmPassword,
      referralCode: fields.referralCode.trim(),
      terms: true, // validated by validateStep(2) above
    });
    setLoading(false);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors ?? {});
      if (result.error) {
        setFormError(result.error);
        setShakeKey((k) => k + 1);
        toast({ title: result.error, tone: "error" });
      }
      // Jump back to the step containing the field error.
      if (result.fieldErrors?.fullName || result.fieldErrors?.email) {
        setDirection(-1);
        setStep(0);
      } else if (result.fieldErrors?.password || result.fieldErrors?.confirmPassword) {
        setDirection(-1);
        setStep(1);
      }
      return;
    }

    const needsVerification = (result.redirectTo ?? "").startsWith("/verify-email");
    if (needsVerification) {
      setDone({ email: fields.email.trim(), needsVerification: true });
      toast({ title: result.message ?? "Please check your email to verify your account.", tone: "success" });
      return;
    }
    toast({ title: result.message ?? "Welcome to TGL.", tone: "success" });
    router.push(safeNext(next) ?? result.redirectTo ?? "/dashboard");
    router.refresh();
  }

  async function onGoogle() {
    if (disabled || googleLoading) return;
    setGoogleLoading(true);
    const result = await getGoogleOAuthUrl(next);
    if (!result.ok || !result.oauthUrl) {
      setGoogleLoading(false);
      toast({ title: result.error ?? "Google sign-up isn't available.", tone: "error" });
      return;
    }
    window.location.assign(result.oauthUrl);
  }

  if (done?.needsVerification) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
          <motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden
            initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <path d="M5 12.5 10 17.5 19 7" stroke="#20C982" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>
        <h1 className="text-[26px] font-semibold tracking-tight text-charcoal">Check your email</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-charcoal-500">
          We sent a verification link to <span className="font-medium text-charcoal">{done.email}</span>.
          Click it to activate your account, then sign in.
        </p>
        <div className="mt-6">
          <Button variant="secondary" fullWidth onClick={() => router.push("/verify-email?email=" + encodeURIComponent(done.email))}>
            Verification help
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <fieldset disabled={disabled} className="disabled:opacity-60">
      <div className="mb-6">
        <h1 className="text-[26px] font-semibold tracking-tight text-charcoal">
          Create your account
        </h1>
        <p className="mt-1.5 text-[15px] text-charcoal-500">
          Start learning, building, and growing today.
        </p>
      </div>

      {/* Animated progress indicator */}
      <div className="mb-7" aria-hidden>
        <div className="flex items-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <motion.span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-medium ${
                    i < step ? "bg-forest text-white" : i === step ? "bg-forest text-white" : "bg-mist text-charcoal-400"
                  }`}
                  animate={i <= step ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {i < step ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M2.5 6.2 5 8.5 9.7 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </motion.span>
                <span className={`text-[11px] ${i === step ? "font-medium text-charcoal" : "text-charcoal-400"}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-2 mb-5 h-0.5 flex-1 overflow-hidden rounded-full bg-mist">
                  <motion.div
                    className="h-full bg-emerald"
                    initial={false}
                    animate={{ scaleX: i < step ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    style={{ originX: 0 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: 32 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 * direction }}
              transition={{ duration: 0.28, ease: EASE }}
              className="space-y-4"
            >
              {step === 0 && (
                <>
                  <Input label="Full name" autoComplete="name" placeholder="Aarav Sharma" value={fields.fullName}
                    onChange={(e) => set("fullName")(e.target.value)} error={fieldErrors.fullName} shakeKey={shakeKey} required />
                  <Input label="Email address" type="email" autoComplete="email" placeholder="you@example.com" value={fields.email}
                    onChange={(e) => set("email")(e.target.value)} error={fieldErrors.email} shakeKey={shakeKey} required />
                </>
              )}
              {step === 1 && (
                <>
                  <div>
                    <PasswordInput label="Password" autoComplete="new-password" placeholder="At least 8 characters"
                      value={fields.password} onChange={(e) => set("password")(e.target.value)}
                      error={fieldErrors.password} shakeKey={shakeKey} required />
                    <PasswordStrength password={fields.password} />
                  </div>
                  <PasswordInput label="Confirm password" autoComplete="new-password" placeholder="Repeat your password"
                    value={fields.confirmPassword} onChange={(e) => set("confirmPassword")(e.target.value)}
                    error={fieldErrors.confirmPassword} shakeKey={shakeKey} required />
                </>
              )}
              {step === 2 && (
                <>
                  <Input label="Referral code (optional)" placeholder="e.g. GRASS-2024" value={fields.referralCode}
                    onChange={(e) => set("referralCode")(e.target.value)} hint="Have a code from a friend? It's optional." />
                  <div>
                    <Checkbox
                      label={<span>I agree to the <Link href="/terms" className="font-medium text-forest underline underline-offset-2">Terms of Service</Link> and <Link href="/privacy" className="font-medium text-forest underline underline-offset-2">Privacy Policy</Link>.</span>}
                      checked={fields.terms}
                      onChange={(e) => set("terms")(e.target.checked)}
                    />
                    {fieldErrors.terms && <p role="alert" className="mt-1.5 text-[13px] text-red-600">{fieldErrors.terms}</p>}
                  </div>
                  <p className="rounded-xl bg-mist px-4 py-3 text-[13px] leading-relaxed text-charcoal-500">
                    TGL is open to all eligible learners — you don&apos;t need to be a creator,
                    and a referral code is never required.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {formError && (
          <p role="alert" className="mt-4 text-sm text-red-600">{formError}</p>
        )}

        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <Button type="button" variant="secondary" onClick={() => go(-1)} className="shrink-0">
              Back
            </Button>
          )}
          {step < 2 ? (
            <Button type="button" fullWidth onClick={() => go(1)}>
              Continue
            </Button>
          ) : (
            <Button type="submit" loading={loading} fullWidth size="lg">
              {loading ? "Creating account…" : "Create account"}
            </Button>
          )}
        </div>
      </form>

      {isGoogleOAuthEnabled() && (
        <>
          <div className="my-6"><Divider label="or continue with" /></div>
          <GoogleButton onClick={onGoogle} loading={googleLoading} label="Sign up with Google" />
        </>
      )}

      <p className="mt-7 text-center text-sm text-charcoal-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-forest hover:text-forest-700">
          Sign in
        </Link>
      </p>
    </fieldset>
  );
}
