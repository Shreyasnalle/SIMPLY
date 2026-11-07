import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PricingColumnProps {
  name: string;
  icon?: React.ReactNode;
  description: string;
  price: number;
  originalPrice?: number;
  promotionText?: string;
  priceNote: string;
  cta: {
    variant: "default" | "glow";
    label: string;
    href: string;
  };
  features: string[];
  variant?: "default" | "glow" | "glow-brand";
  className?: string;
}

const cardVariants: Record<NonNullable<PricingColumnProps["variant"]>, string> = {
  default: "border-white/10 bg-card",
  glow: "border-white/15 bg-card shadow-[0_0_40px_-12px_rgba(255,255,255,0.15)]",
  "glow-brand":
    "border-white/25 bg-card",
};

export function PricingColumn({
  name,
  icon,
  description,
  price,
  originalPrice,
  promotionText,
  priceNote,
  cta,
  features,
  variant = "default",
  className,
}: PricingColumnProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-6 overflow-hidden rounded-2xl border p-6 text-card-foreground",
        cardVariants[variant],
        className,
      )}
    >
      {variant === "glow-brand" && (
        <>
          {/* Spotlight: soft cone of light falling from the top edge */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-64"
            style={{
              background:
                "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 45%, transparent 75%)",
            }}
          />
          {/* Bright core line at the top edge */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-px w-3/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent"
          />
        </>
      )}

      <div className="relative flex flex-col gap-2">
        <div className="flex items-center gap-2 text-2xl font-semibold text-foreground">
          {icon}
          {name}
          {promotionText && (
            <span className="ml-auto rounded-full bg-foreground px-2 py-0.5 text-xs font-medium text-background">
              {promotionText}
            </span>
          )}
        </div>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>

      <div className="relative flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          {originalPrice !== undefined && (
            <span className="text-lg text-muted-foreground line-through">
              ${originalPrice}
            </span>
          )}
          <span className="text-5xl font-semibold tracking-tight text-foreground">
            ${price}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{priceNote}</p>
      </div>

      <a
        href={cta.href}
        className={cn(
          "relative inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors",
          cta.variant === "default"
            ? "bg-foreground text-background hover:bg-foreground/90"
            : "border border-white/20 bg-white/5 text-foreground hover:bg-white/10",
        )}
      >
        {cta.label}
      </a>

      <ul className="relative flex flex-col gap-2.5 border-t border-white/10 pt-6">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-base text-muted-foreground"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-foreground" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
