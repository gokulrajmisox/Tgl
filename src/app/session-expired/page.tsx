import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Session expired — Touch Grass Later" };

export default function SessionExpiredPage() {
  return (
    <AuthShell>
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-mist">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="#5A636D" strokeWidth="2" />
          <path d="M12 7v5l3.5 2" stroke="#5A636D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="text-[26px] font-semibold tracking-tight text-charcoal">
        Your session expired
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-charcoal-500">
        For your security you&apos;ve been signed out. Sign in again to pick up
        where you left off — anything you saved is untouched.
      </p>
      <div className="mt-6">
        <Link href="/login">
          <Button fullWidth>Sign in again</Button>
        </Link>
      </div>
    </AuthShell>
  );
}
