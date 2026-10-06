import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Reveal, Stagger, StaggerItem, AnimatedNumber, ProgressFill } from "@/components/motion/motion";
import { Card } from "@/components/ui/brand";
import { EmptyState } from "@/components/feedback/primitives";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const metadata = { title: "Dashboard — Touch Grass Later" };

// Session-guarded: never serve a cached redirect (cached redirects can
// lose their Location header), always evaluate at request time.
export const dynamic = "force-dynamic";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const STATS = [
  { label: "Courses in progress", value: 0 },
  { label: "Projects submitted", value: 0 },
  { label: "TGL credits", value: 0 },
  { label: "Certificates earned", value: 0 },
];

export default async function StudentDashboard() {
  const { user, role } = await getSession();
  if (!user) redirect("/login");
  if (role !== "student") redirect("/access-denied");

  const name =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "there";

  return (
    <DashboardShell role={role} name={name}>
      {/* Greeting hero — appears on load */}
      <Reveal y={12}>
        <h1 className="text-[28px] font-semibold tracking-tight text-charcoal">
          {greeting()}, {name}.
        </h1>
        <p className="mt-1.5 text-[15px] text-charcoal-500">
          Here&apos;s where your learning stands today.
        </p>
      </Reveal>

      {/* Stat cards — animate up, numbers count once */}
      <Stagger className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4" gap={0.07}>
        {STATS.map((s) => (
          <StaggerItem key={s.label}>
            <Card className="group p-5 transition-all duration-250 hover:-translate-y-[3px] hover:shadow-lift">
              <p className="text-[34px] font-semibold tracking-tight text-charcoal">
                <AnimatedNumber value={s.value} />
              </p>
              <p className="mt-1 text-sm text-charcoal-500">{s.label}</p>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Reveal delay={0.05}>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-semibold text-charcoal">Internship readiness</h2>
              <span className="text-sm font-medium text-forest">12%</span>
            </div>
            <p className="mt-1 text-sm text-charcoal-500">
              Complete courses and projects to unlock opportunities.
            </p>
            <ProgressFill value={12} className="mt-4" />
          </Card>
        </Reveal>
        <Reveal delay={0.1}>
          <EmptyState
            title="Nothing in progress yet"
            description="Enroll in your first free course to start building momentum."
            action={
              <Link href="/dashboard/courses">
                <Button size="sm">Browse courses</Button>
              </Link>
            }
          />
        </Reveal>
      </div>
    </DashboardShell>
  );
}
