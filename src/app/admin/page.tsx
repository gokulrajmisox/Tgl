import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Reveal, AnimatedNumber } from "@/components/motion/motion";
import { Card } from "@/components/ui/brand";

/**
 * Admin dashboard is deliberately calmer: metrics fade in,
 * no celebratory motion on sensitive operations.
 */
export const metadata = { title: "Admin — Touch Grass Later" };

// Session-guarded: never serve a cached redirect, always evaluate at request time.
export const dynamic = "force-dynamic";

const METRICS = [
  { label: "Total users", value: 0 },
  { label: "Certificates pending", value: 0 },
  { label: "Active internships", value: 0 },
  { label: "Open support tickets", value: 0 },
];

export default async function AdminDashboard() {
  const { user, role } = await getSession();
  if (!user) redirect("/login");
  if (role !== "admin") redirect("/access-denied");

  const name =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    "admin";

  return (
    <DashboardShell role={role} name={name}>
      <Reveal y={12}>
        <h1 className="text-[28px] font-semibold tracking-tight text-charcoal">
          Overview
        </h1>
        <p className="mt-1.5 text-[15px] text-charcoal-500">
          Platform health at a glance.
        </p>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {METRICS.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.05}>
            <Card className="p-5">
              <p className="text-[30px] font-semibold tracking-tight text-charcoal">
                <AnimatedNumber value={m.value} duration={0.6} />
              </p>
              <p className="mt-1 text-sm text-charcoal-500">{m.label}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-6">
        <Card className="p-6">
          <h2 className="text-[17px] font-semibold text-charcoal">Getting started</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-charcoal-500">
            Assign the <span className="font-medium text-charcoal">mentor</span> or{" "}
            <span className="font-medium text-charcoal">admin</span> role from the
            Supabase dashboard (<code className="font-mono text-[13px]">public.profiles</code>).
            Roles can never be self-assigned during signup.
          </p>
        </Card>
      </Reveal>
    </DashboardShell>
  );
}
