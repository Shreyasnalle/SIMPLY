import * as React from "react";
import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id="pricing"
      className={cn("relative w-full scroll-mt-24 bg-background px-4 py-24 sm:px-8 sm:py-32", className)}
    >
      {children}
    </section>
  );
}
