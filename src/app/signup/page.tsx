import { AuthShell } from "@/components/auth/AuthShell";
import { ConfigNotice } from "@/components/auth/ConfigNotice";
import { SignupForm } from "./SignupForm";
import { isSupabaseConfigured } from "@/lib/auth/config";

export const metadata = { title: "Create an account — Touch Grass Later" };

export default function SignupPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const configured = isSupabaseConfigured();
  return (
    <AuthShell>
      {!configured && (
        <div className="mb-6">
          <ConfigNotice context="create an account" />
        </div>
      )}
      <SignupForm next={searchParams.next} disabled={!configured} />
    </AuthShell>
  );
}
