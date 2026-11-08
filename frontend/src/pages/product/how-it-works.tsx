import Link from "next/link";
import { DocsLayout } from "@/components/docs-layout";

export default function HowItWorksPage() {
  return (
    <DocsLayout
      title="How it works"
      section="Our Product"
      description="Simply reads the lecture as you watch, cleans it up, and answers your questions from what was actually taught."
    >
      <h2>Overview</h2>
      <p>
        Simply is a browser extension and web platform that turns YouTube into an interactive learning experience.
        Instead of switching tabs and pasting captions into a chatbot, you ask your question right where you are
        watching and get an answer based on the video.
      </p>

      <h2>The four steps</h2>
      <ol>
        <li>
          <strong>Open a YouTube video.</strong> The extension picks up the captions, title, channel, description
          and chapters of the video. No copy-pasting.
        </li>
        <li>
          <strong>The transcript is cleaned.</strong> Noise such as [Music] is removed, repeated lines are merged,
          timestamps are fixed and the video is split into its chapters.
        </li>
        <li>
          <strong>Mis-heard terms are corrected.</strong> An AI pass reads the title and summary of the video and
          fixes technical terms the auto-captions got wrong.
        </li>
        <li>
          <strong>You ask a question.</strong> Your question is matched against the most relevant parts of the
          lecture, and the answer is written from that content, with clickable timestamps.
        </li>
      </ol>

      <h2>Under the hood</h2>
      <ul>
        <li>
          <strong>Browser extension:</strong> built with Manifest V3. It extracts the caption data from the YouTube
          page and provides the popup where you ask questions.
        </li>
        <li>
          <strong>Backend API:</strong> a FastAPI service that chunks the transcript and creates vector embeddings,
          stored in PostgreSQL with pgvector.
        </li>
        <li>
          <strong>Retrieval:</strong> your question is embedded, the closest chunks are found, and the answer is
          streamed back based strictly on the video content.
        </li>
        <li>
          <strong>Web app:</strong> a Next.js app for sign in, account settings and guides.
        </li>
      </ul>

      <p>
        Next: see the <Link href="/product/features">features</Link>.
      </p>
    </DocsLayout>
  );
}
