import Link from "next/link";
import { InfoPage, Block, Card } from "@/components/info-page";
import HowItWorks from "@/pages/landingpage/HowItWorks";

const steps = [
  ["1. Open a YouTube video", "The Simply extension picks up the captions, title, channel, description and chapters of the video you are watching. No copy-pasting."],
  ["2. We clean the transcript", "Noise such as [Music] is removed, repeated lines are merged, timestamps are fixed and the video is split into its chapters."],
  ["3. AI fixes what was mis-heard", "An AI pass reads the title and summary, then corrects technical terms the auto-captions got wrong."],
  ["4. Ask your question", "Your question is matched against the most relevant parts of the lecture, and the answer is written strictly from that content, with clickable timestamps."],
] as const;

export default function HowItWorksPage() {
  return (
    <InfoPage
      title="How it works"
      eyebrow="Our product"
      heading="From a YouTube tab to answers you can trust"
      description="Simply reads the lecture as you watch, cleans it up, and answers your questions from what was actually taught."
    >
      <Block title="The four steps">
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map(([t, d]) => (
            <Card key={t} title={t}>{d}</Card>
          ))}
        </div>
      </Block>
      <HowItWorks />
      <Block title="Under the hood">
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          A Manifest V3 browser extension captures the video data. A FastAPI backend chunks the transcript and
          turns it into vector embeddings stored in PostgreSQL with pgvector. When you ask a question, Simply
          embeds it, finds the closest chunks, and streams a grounded answer back through Groq. Answers come
          only from the video, so they stay on topic.
        </p>
        <Link href="/product/features" className="mt-6 inline-block text-sm text-foreground underline underline-offset-4">
          See everything Simply can do →
        </Link>
      </Block>
    </InfoPage>
  );
}
