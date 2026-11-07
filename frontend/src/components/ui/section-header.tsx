import * as React from "react";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/** Shared eyebrow + title + description block so every section lines up. */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  const center = align === "center";
  return (
    <Reveal>
      <div
        className={cn(
          "flex flex-col gap-6 px-5 py-10 sm:px-8",
          center ? "items-center text-center" : "items-start text-left",
          className,
        )}
      >
        <div className={cn("flex flex-col gap-2", center ? "items-center" : "items-start")}>
          {eyebrow && <h2 className="text-sm font-medium leading-5 text-muted-foreground">{eyebrow}</h2>}
          <h3 className="text-balance text-xl font-semibold leading-8 tracking-[-0.02em] text-foreground sm:text-2xl">
            {title}
          </h3>
        </div>
        {description && (
          <p className="max-w-[800px] text-pretty text-base leading-6 text-muted-foreground">{description}</p>
        )}
      </div>
    </Reveal>
  );
}
