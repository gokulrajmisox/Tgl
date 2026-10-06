import { AuthShell } from "@/components/auth/AuthShell";
import { ConfigNotice } from "@/components/auth/ConfigNotice";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { isSupabaseConfigured } from "@/lib/auth/config";

export const metadata = { title: "Forgot password — Touch Grass Later" };

export default function ForgotPasswordPage() {
  const configured = isSupabaseConfigured();
  return (
    <AuthShell>
      {!configured && (
        <div className="mb-6">
          <ConfigNotice context="reset your password" />
        </div>
      )}
      <ForgotPasswordForm disabled={!configured} />
    </AuthShell>
  );
}
