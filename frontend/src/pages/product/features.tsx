import Link from "next/link";
import { DocsLayout } from "@/components/docs-layout";

export default function FeaturesPage() {
  return (
    <DocsLayout
      title="Features"
      section="Our Product"
      description="Simply turns any educational YouTube video into a tutor you can talk to and a study pack you can download."
    >
      <h2>Ask anything about the video</h2>
      <p>
        Answers come from the video itself: its captions, chapters, title and description. Every answer includes
        timestamps you can click to jump straight to that moment.
      </p>

      <h2>Text and voice</h2>
      <p>
        Type your question or say it out loud. Answers can be read aloud, so you can study hands-free while you
        cook, commute or take notes.
      </p>

      <h2>Web search</h2>
      <p>
        When the lecture does not cover something, Simply can search the web. Video sources and web sources are
        kept clearly separate, and you can switch between video only and video plus web.
      </p>

      <h2>Study material from the video</h2>
      <p>Generate files built only from that video&apos;s content:</p>
      <ul>
        <li>Word notes (.docx), chapter summaries and glossaries</li>
        <li>PowerPoint decks (.pptx) built from the lecture&apos;s chapters</li>
        <li>Excel sheets (.xlsx) with tables and data from the video</li>
        <li>PDF cheat sheets and revision handouts</li>
        <li>Flashcards and quizzes, exportable to Anki</li>
      </ul>

      <h2>Quizzes and flashcards</h2>
      <p>
        Chapter-end quizzes with explanations, plus spaced-repetition flashcards, help the material stick.
      </p>

      <h2>Explained at your level</h2>
      <p>From &quot;like I&apos;m 5&quot; to expert. Simply remembers how you like things explained.</p>

      <h2>Cleaned transcript</h2>
      <p>
        Noise is removed, repeated lines are merged, the video is split by chapters, and technical terms are
        corrected using the title and summary.
      </p>

      <p>
        See the <Link href="/product/pricing">pricing</Link> for which plan includes what.
      </p>
    </DocsLayout>
  );
}
