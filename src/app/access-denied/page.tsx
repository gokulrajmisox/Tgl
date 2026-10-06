import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { getSession } from "@/lib/auth/session";
import { roleHome } from "@/lib/auth/roles";

export const metadata = { title: "Access denied — Touch Grass Later" };

// Reads the live session: never serve a cached copy.
export const dynamic = "force-dynamic";

export default async function AccessDeniedPage() {
  const { role } = await getSession();
  const home = role ? roleHome(role) : "/";
  return (
    <AuthShell>
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="#DC2626" strokeWidth="2" />
          <path d="M8 8l8 8M16 8l-8 8" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="text-[26px] font-semibold tracking-tight text-charcoal">
        You don&apos;t have access here
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-charcoal-500">
        This area is restricted to a different role. If you think this is a
        mistake, contact your administrator.
      </p>
      <div className="mt-6">
        <Link href={home}>
          <Button fullWidth>Go to my dashboard</Button>
        </Link>
      </div>
    </AuthShell>
  );
}
