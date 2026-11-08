import Link from "next/link";
import { InfoPage, Block } from "@/components/info-page";
import Pricing from "@/pages/landingpage/Pricing";

export default function PricingPage() {
  return (
    <InfoPage
      title="Pricing"
      eyebrow="Our product"
      heading="Simple pricing for serious learners"
      description="Start free. Upgrade when you want voice, web search and one-click study packs."
    >
      <Pricing />
      <Block title="Questions about plans?">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Check the <Link href="/company/faq" className="text-foreground underline underline-offset-4">FAQ</Link>{" "}
          or <Link href="/company/contact" className="text-foreground underline underline-offset-4">get in touch</Link>.
          Free stays free, and Pro can be cancelled anytime.
        </p>
      </Block>
    </InfoPage>
  );
}
