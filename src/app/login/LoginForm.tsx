"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInAction, getGoogleOAuthUrl } from "@/lib/auth/actions";
import { isGoogleOAuthEnabled } from "@/lib/auth/config";
import { safeNext } from "@/lib/url";
import { Input, PasswordInput, Checkbox } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/brand";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useToast } from "@/components/feedback/Toaster";

export function LoginForm({
  next,
  disabled,
}: {
  next?: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (disabled || loading) return;
    setLoading(true);
    setFieldErrors({});
    setFormError(null);

    const result = await signInAction({ email, password });
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
    toast({ title: result.message ?? "Welcome back. You're signed in.", tone: "success" });
    router.push(safeNext(next) ?? result.redirectTo ?? "/dashboard");
    router.refresh();
  }

  async function onGoogle() {
    if (disabled || googleLoading) return;
    setGoogleLoading(true);
    const result = await getGoogleOAuthUrl(next);
    if (!result.ok || !result.oauthUrl) {
      setGoogleLoading(false);
      toast({ title: result.error ?? "Google sign-in isn't available.", tone: "error" });
      return;
    }
    window.location.assign(result.oauthUrl);
  }

  return (
    <fieldset disabled={disabled} className="disabled:opacity-60">
      <div className="mb-8">
        <h1 className="text-[26px] font-semibold tracking-tight text-charcoal">
          Welcome back
        </h1>
        <p className="mt-1.5 text-[15px] text-charcoal-500">
          Sign in to continue your journey.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          shakeKey={shakeKey}
          required
        />
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          shakeKey={shakeKey}
          required
        />

        <div className="flex items-center justify-between pt-0.5">
          <Checkbox
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-forest hover:text-forest-700"
          >
            Forgot password?
          </Link>
        </div>

        {formError && !fieldErrors.email && !fieldErrors.password && (
          <p role="alert" className="text-sm text-red-600">
            {formError}
          </p>
        )}

        <Button type="submit" loading={loading} fullWidth size="lg">
          {loading ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      {isGoogleOAuthEnabled() && (
        <>
          <div className="my-6">
            <Divider label="or continue with" />
          </div>
          <GoogleButton onClick={onGoogle} loading={googleLoading} />
        </>
      )}

      <p className="mt-7 text-center text-sm text-charcoal-500">
        New to TGL?{" "}
        <Link href="/signup" className="font-medium text-forest hover:text-forest-700">
          Create an account
        </Link>
      </p>
    </fieldset>
  );
}
