import { User, Users } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  PricingColumn,
  PricingColumnProps,
} from "@/components/ui/pricing-utils/pricing-column";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/pricing-utils/section";

interface PricingProps {
  title?: string | false;
  description?: string | false;
  plans?: PricingColumnProps[] | false;
  className?: string;
}

const DEFAULT_PRICING_PLANS: PricingColumnProps[] = [
  {
    name: "Free",
    description: "For everyone starting out on a website for their big idea",
    price: 0,
    priceNote: "Free and open-source forever. Get started now.",
    cta: { variant: "glow", label: "Get started for free", href: "#" },
    features: ["1 website template", "9 blocks and sections", "4 custom animations"],
    variant: "default",
    className: "hidden lg:flex",
  },
  {
    name: "Pro",
    icon: <User className="size-4" />,
    description: "For early-stage founders, solopreneurs and indie devs",
    price: 99,
    priceNote: "Lifetime access. Free updates. No recurring fees.",
    cta: { variant: "default", label: "Get all-access", href: "#" },
    features: [
      "$1000 templates",
      "$1000 blocks and sections",
      "$1000 illustrations",
      "$1000 custom animations",
    ],
    variant: "glow-brand",
  },
  {
    name: "Pro Team",
    icon: <Users className="size-4" />,
    description: "For teams and agencies working on cool products together",
    price: 499,
    priceNote: "Lifetime access. Free updates. No recurring fees.",
    cta: { variant: "default", label: "Get all-access for your team", href: "#" },
    features: [
      "All the templates, components and sections available for your entire team",
    ],
    variant: "glow",
  },
];

export default function Pricing({
  title = "Build your dream landing page, today.",
  description = "Get lifetime access to all the components. No recurring fees. Just simple, transparent pricing.",
  plans = DEFAULT_PRICING_PLANS,
  className = "",
}: PricingProps) {
  return (
    <Section className={cn("overflow-hidden", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(255,255,255,0.07),transparent_70%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-14">
        {(title || description) && (
          <SectionHeader
            eyebrow="Pricing"
            title={title || ""}
            description={description || undefined}
          />
        )}
        {plans !== false && plans.length > 0 && (
          <div className="mx-auto grid w-full max-w-md grid-cols-1 items-stretch gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1} className={plan.className ?? "flex"}>
                <PricingColumn {...plan} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
