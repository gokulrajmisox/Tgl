import { AuthShell } from "@/components/auth/AuthShell";
import { ConfigNotice } from "@/components/auth/ConfigNotice";
import { VerifyEmailPanel } from "./VerifyEmailPanel";
import { isSupabaseConfigured } from "@/lib/auth/config";

export const metadata = { title: "Verify your email — Touch Grass Later" };

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const configured = isSupabaseConfigured();
  return (
    <AuthShell>
      {!configured && (
        <div className="mb-6">
          <ConfigNotice context="verify your email" />
        </div>
      )}
      <VerifyEmailPanel email={searchParams.email} disabled={!configured} />
    </AuthShell>
  );
}
