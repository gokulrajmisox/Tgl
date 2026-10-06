import { PageFade } from "@/components/motion/motion";

/** Subtle route transition applied to every page. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageFade>{children}</PageFade>;
}
