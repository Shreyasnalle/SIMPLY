import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Zernio-style ruled column: every section after the hero sits in the same
 * 1080px frame with continuous vertical rules and a top rule, so the page
 * reads as one uniform sheet instead of unrelated bands.
 */
export function SectionFrame({
  id,
  className,
  innerClassName,
  children,
}: {
  id?: string;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("relative w-full scroll-mt-24 bg-stripes-side", className)}>
      <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-8">
        <div className={cn("border-x border-t border-white/10 bg-background", innerClassName)}>{children}</div>
      </div>
    </section>
  );
}

/** Empty ruled row with vertical cell dividers, used as a breather between sections. */
export function RuleSpacer({ cells = 3, height = 120 }: { cells?: number; height?: number }) {
  return (
    <div aria-hidden className="bg-stripes-side w-full"><div className="mx-auto w-full max-w-[1200px] px-6 lg:px-8">
      <div className="flex items-stretch border-x border-t border-white/10 bg-background" style={{ height }}>
        {Array.from({ length: cells }).map((_, i) => (
          <div key={i} className={cn("flex-1", i < cells - 1 && "border-r border-white/10")} />
        ))}
      </div>
    </div></div>
  );
}
