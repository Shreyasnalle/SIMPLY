import { User, Users } from "lucide-react";


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
    description: "For curious learners trying Simply on their everyday videos",
    price: 0,
    priceNote: "Free forever. No card needed.",
    cta: { variant: "glow", label: "Get the extension", href: "#" },
    features: [
      "Ask questions about any video (text)",
      "Clickable timestamp citations",
      "Cleaned, chapter-wise transcript",
      "5 AI answers with web search a day",
    ],
    variant: "default",
    className: "hidden lg:flex",
  },
  {
    name: "Pro",
    icon: <User className="size-4" />,
    description: "For students who learn on YouTube every day",
    price: 9,
    priceNote: "per month. Cancel anytime.",
    cta: { variant: "default", label: "Go Pro", href: "#" },
    features: [
      "Unlimited questions, text and voice",
      "Answers read aloud, hands-free mode",
      "Unlimited web search",
      "Export to DOC, PPT, XLS and PDF",
      "Quizzes, flashcards and Anki export",
      "Explain at your level",
    ],
    variant: "glow-brand",
  },
  {
    name: "Campus",
    icon: <Users className="size-4" />,
    description: "For study groups, classes and coaching teams",
    price: 29,
    priceNote: "per month for up to 10 learners.",
    cta: { variant: "default", label: "Get Campus", href: "#" },
    features: [
      "Everything in Pro for every seat",
      "Multi-video and playlist study packs",
      "Shared notes and study rooms",
      "Priority support",
    ],
    variant: "glow",
  },
];

export default function Pricing({
  title = "Simple pricing for serious learners.",
  description = "Start free. Upgrade when you want voice, web search and one-click study packs.",
  plans = DEFAULT_PRICING_PLANS,
  className = "",
}: PricingProps) {
  return (
    <Section className={className}>
      <div className="relative flex flex-col items-center">
        {(title || description) && (
          <SectionHeader
            eyebrow="Pricing"
            title={title || ""}
            description={description || undefined}
          />
        )}
        {plans !== false && plans.length > 0 && (
          <div className="mx-auto grid w-full max-w-md grid-cols-1 items-stretch gap-6 px-5 pb-10 sm:max-w-none sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
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
