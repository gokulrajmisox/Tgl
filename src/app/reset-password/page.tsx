import { AuthShell } from "@/components/auth/AuthShell";
import { ConfigNotice } from "@/components/auth/ConfigNotice";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { isSupabaseConfigured } from "@/lib/auth/config";

export const metadata = { title: "Reset password — Touch Grass Later" };

export default function ResetPasswordPage() {
  const configured = isSupabaseConfigured();
  return (
    <AuthShell>
      {!configured && (
        <div className="mb-6">
          <ConfigNotice context="reset your password" />
        </div>
      )}
      <ResetPasswordForm disabled={!configured} />
    </AuthShell>
  );
}
