import Link from "next/link";
import { DocsLayout } from "@/components/docs-layout";

export default function AboutPage() {
  return (
    <DocsLayout
      title="About Us"
      section="Company"
      description="Simply is an open-source AI teaching assistant that lives next to your YouTube videos."
    >
      <h2>Why we built Simply</h2>
      <p>
        YouTube is where the world learns, but a long lecture is hard to use. You switch tabs, paste captions into
        a chatbot, give it context, and still get answers that drift away from what was taught. Simply removes
        that loop: it reads the video for you and answers right where you are watching.
      </p>

      <h2>What we believe</h2>
      <ul>
        <li>
          <strong>Grounded answers.</strong> Answers come from the video itself, with timestamps, so you can check
          the source.
        </li>
        <li>
          <strong>No friction.</strong> No tab switching and no copy-paste.
        </li>
        <li>
          <strong>Open source.</strong> The browser extension, backend and web app are built in the open.
        </li>
      </ul>

      <p>
        Have a question or idea? <Link href="/company/contact">Contact us</Link>.
      </p>
    </DocsLayout>
  );
}
