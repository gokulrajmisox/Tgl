"use client";

import { MotionConfig } from "framer-motion";
import { ToastProvider } from "@/components/feedback/Toaster";
import type { ReactNode } from "react";

/** Global providers: reduced-motion respect + toasts. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>{children}</ToastProvider>
    </MotionConfig>
  );
}
