import Link from "next/link";
import { DocsLayout } from "@/components/docs-layout";

export default function PricingPage() {
  return (
    <DocsLayout
      title="Pricing"
      section="Our Product"
      description="Start free. Upgrade when you want voice, web search and one-click study packs."
    >
      <h2>Free — $0</h2>
      <p>For curious learners trying Simply on their everyday videos. Free forever, no card needed.</p>
      <ul>
        <li>Ask questions about any video (text)</li>
        <li>Clickable timestamp citations</li>
        <li>Cleaned, chapter-wise transcript</li>
      </ul>

      <h2>Pro — $9 per month</h2>
      <p>For students who learn on YouTube every day. Cancel anytime.</p>
      <ul>
        <li>Unlimited questions, text and voice</li>
        <li>Answers read aloud, hands-free mode</li>
        <li>Export to DOC, PPT, XLS and PDF</li>
        <li>Quizzes, flashcards and Anki export</li>
        <li>Explain at your level</li>
      </ul>

      <h2>Campus — $29 per month</h2>
      <p>For study groups, classes and coaching teams. Covers up to 10 learners.</p>
      <ul>
        <li>Everything in Pro for every seat</li>
        <li>Multi-video and playlist study packs</li>
        <li>Shared notes and study rooms</li>
      </ul>

      <p>
        Questions about plans? Read the <Link href="/company/faq">FAQ</Link> or{" "}
        <Link href="/company/contact">contact us</Link>.
      </p>
    </DocsLayout>
  );
}
