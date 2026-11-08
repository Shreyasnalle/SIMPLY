import { InfoPage, Block } from "@/components/info-page";

const faqs = [
  ["What is Simply?", "An AI teaching assistant for YouTube. It reads the captions, chapters and details of the video you are watching and answers your questions from them."],
  ["Which videos does it work with?", "YouTube videos with captions. Support for other platforms may come later."],
  ["Will answers go beyond the video?", "By default answers come only from the video. With web search on, Simply can look further and keeps video and web sources clearly separate."],
  ["How does it get the transcript?", "The browser extension reads the captions and details directly from the YouTube page, then the backend cleans them and fixes mis-heard technical terms."],
  ["Is it free?", "Yes, there is a free plan with text questions, timestamp citations and a cleaned transcript. Pro and Campus add voice, exports, quizzes and more."],
  ["Can I export study material?", "On Pro you can generate DOC, PPT, XLS and PDF files, plus flashcards for Anki, all built from the video."],
  ["Is it open source?", "Yes. The extension, backend and web app are developed in the open."],
] as const;

export default function FaqPage() {
  return (
    <InfoPage
      title="FAQ"
      eyebrow="Company"
      heading="Frequently asked questions"
      description="Quick answers about how Simply works, what it costs and what it can do."
    >
      <Block>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {faqs.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-foreground">
                {q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </Block>
    </InfoPage>
  );
}
