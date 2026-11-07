import * as React from "react";
import { SectionFrame } from "@/components/ui/section-frame";

export function Section({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <SectionFrame id="pricing" innerClassName={className}>
      {children}
    </SectionFrame>
  );
}
