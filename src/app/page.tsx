import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/site/SiteNav";
import { HeroSequence } from "./HeroSequence";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/motion";
import { Card } from "@/components/ui/brand";

export const metadata = {
  title: "Touch Grass Later — Learn. Build. Grow.",
  description:
    "Learn new skills, build real projects, and unlock internship opportunities.",
};

const FEATURES = [
  {
    title: "Free courses & certificates",
    text: "Structured learning paths with certificates you can actually verify.",
  },
  {
    title: "Real projects, mentor feedback",
    text: "Build portfolio-worthy work and get reviewed by experienced mentors.",
  },
  {
    title: "Internships that count",
    text: "Unlock internship opportunities matched to your skills and progress.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-paper">
      <SiteNav />

      {/* Hero — staggered entrance per the motion spec */}
      <section className="relative overflow-hidden pt-[72px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-emerald-100/50 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
          <HeroSequence />
        </div>
      </section>

      {/* Features — scroll reveal with stagger */}
      <section id="courses" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight text-charcoal">
            Everything you need to grow
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[15px] text-charcoal-500">
            One platform for learning, building, and getting hired.
          </p>
        </Reveal>
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-3" gap={0.08}>
          {FEATURES.map((f) => (
            <StaggerItem key={f.title}>
              <Card className="h-full p-6 transition-all duration-250 hover:-translate-y-[3px] hover:shadow-lift">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                    <path d="M10 17.5c0-4 0-6.5 0-9m0 0c0-2.5 2-4.5 5-4.5 0 3-2 5-5 4.5Zm0 0c0-2.5-2-4.5-5-4.5 0 3 2 5 5 4.5Z"
                      stroke="#20C982" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-[17px] font-semibold text-charcoal">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{f.text}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <Reveal className="overflow-hidden rounded-3xl bg-forest px-8 py-14 text-center sm:px-14">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Your next chapter starts here.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-white/70">
            Join thousands of learners building real skills and real careers.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex h-12 items-center rounded-xl bg-emerald px-7 text-base font-medium text-forest transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
          >
            Create a free account
          </Link>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
