import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Reveal, Stagger, StaggerItem, AnimatedNumber } from "@/components/motion/motion";
import { Card } from "@/components/ui/brand";
import { EmptyState } from "@/components/feedback/primitives";

export const metadata = { title: "Mentor dashboard — Touch Grass Later" };

// Session-guarded: never serve a cached redirect, always evaluate at request time.
export const dynamic = "force-dynamic";

const STATS = [
  { label: "Pending reviews", value: 0 },
  { label: "Students mentored", value: 0 },
  { label: "Avg. feedback rating", value: 0 },
];

export default async function MentorDashboard() {
  const { user, role } = await getSession();
  if (!user) redirect("/login");
  if (role !== "mentor" && role !== "admin") redirect("/access-denied");

  const name =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "mentor";

  return (
    <DashboardShell role="mentor" name={name}>
      <Reveal y={12}>
        <h1 className="text-[28px] font-semibold tracking-tight text-charcoal">
          Welcome back, {name}.
        </h1>
        <p className="mt-1.5 text-[15px] text-charcoal-500">
          Students are waiting on your feedback.
        </p>
      </Reveal>

      <Stagger className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-3" gap={0.07}>
        {STATS.map((s) => (
          <StaggerItem key={s.label}>
            <Card className="p-5 transition-all duration-250 hover:-translate-y-[3px] hover:shadow-lift">
              <p className="text-[34px] font-semibold tracking-tight text-charcoal">
                <AnimatedNumber value={s.value} />
              </p>
              <p className="mt-1 text-sm text-charcoal-500">{s.label}</p>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.08} className="mt-6">
        <EmptyState
          title="No submissions to review"
          description="New student projects will appear here as soon as they're submitted."
        />
      </Reveal>
    </DashboardShell>
  );
}
