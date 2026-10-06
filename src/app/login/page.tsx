import { AuthShell } from "@/components/auth/AuthShell";
import { ConfigNotice } from "@/components/auth/ConfigNotice";
import { LoginForm } from "./LoginForm";
import { isSupabaseConfigured } from "@/lib/auth/config";

export const metadata = { title: "Sign in — Touch Grass Later" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  const configured = isSupabaseConfigured();
  return (
    <AuthShell>
      {!configured && (
        <div className="mb-6">
          <ConfigNotice context="sign in" />
        </div>
      )}
      {searchParams.error === "callback_failed" && (
        <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          We couldn&apos;t complete that sign-in. Please try again.
        </p>
      )}
      <LoginForm next={searchParams.next} disabled={!configured} />
    </AuthShell>
  );
}
