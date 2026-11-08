import { DocsLayout } from "@/components/docs-layout";

export default function FaqPage() {
  return (
    <DocsLayout
      title="FAQ"
      section="Company"
      description="Quick answers about how Simply works, what it costs and what it can do."
    >
      <h2>What is Simply?</h2>
      <p>
        An AI teaching assistant for YouTube. It reads the captions, chapters and details of the video you are
        watching and answers your questions from them.
      </p>

      <h2>Which videos does it work with?</h2>
      <p>YouTube videos with captions. Support for other platforms may come later.</p>

      <h2>Will answers go beyond the video?</h2>
      <p>
        By default answers come only from the video. With web search on, Simply can look further and keeps video
        and web sources clearly separate.
      </p>

      <h2>How does it get the transcript?</h2>
      <p>
        The browser extension reads the captions and details from the YouTube page. The backend then cleans them
        and fixes mis-heard technical terms.
      </p>

      <h2>Is it free?</h2>
      <p>
        Yes. The free plan includes text questions, timestamp citations and a cleaned transcript. Pro and Campus
        add voice, exports, quizzes and more.
      </p>

      <h2>Can I export study material?</h2>
      <p>On Pro you can generate DOC, PPT, XLS and PDF files, plus flashcards for Anki, all built from the video.</p>

      <h2>Is it open source?</h2>
      <p>Yes. The extension, backend and web app are developed in the open.</p>
    </DocsLayout>
  );
}
