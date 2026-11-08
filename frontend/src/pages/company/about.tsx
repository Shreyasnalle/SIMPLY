import Link from "next/link";
import { InfoPage, Block, Card } from "@/components/info-page";

export default function AboutPage() {
  return (
    <InfoPage
      title="About Us"
      eyebrow="Company"
      heading="Learning shouldn't need ten tabs"
      description="Simply is an open-source AI teaching assistant that lives next to your YouTube videos."
    >
      <Block title="Why we built Simply">
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          YouTube is where the world learns, but a long lecture is hard to use. You switch tabs, paste captions
          into a chatbot, give it context, and still get answers that drift away from what was taught. Simply
          removes that loop: it reads the video for you and answers right where you are watching.
        </p>
      </Block>
      <Block title="What we believe">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card title="Grounded answers">Answers come from the video itself, with timestamps, so you can check the source.</Card>
          <Card title="No friction">No tab switching, no copy-paste. Learning happens in the page you already have open.</Card>
          <Card title="Open source">Simply is built in the open: a browser extension, a Python backend and this web app.</Card>
        </div>
      </Block>
      <Block title="Get in touch">
        <p className="text-sm text-muted-foreground sm:text-base">
          Questions or ideas? <Link href="/company/contact" className="text-foreground underline underline-offset-4">Contact us</Link>.
        </p>
      </Block>
    </InfoPage>
  );
}
