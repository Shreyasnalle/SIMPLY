import { InfoPage, Block, Card } from "@/components/info-page";
import Features from "@/pages/landingpage/Features";

const more = [
  ["Timestamp citations", "Every answer points to the exact moment in the video. Click to jump straight there."],
  ["Voice and hands-free", "Ask by voice and have answers read aloud while you cook, commute or take notes."],
  ["Web search", "When the lecture does not cover it, Simply searches the web and keeps video and web sources separate."],
  ["Study packs", "Generate Word notes, PowerPoint decks, Excel sheets and PDF cheat sheets from a single video."],
  ["Quizzes and flashcards", "Chapter-end quizzes with explanations, plus spaced-repetition cards you can export to Anki."],
  ["Explained at your level", "From 'like I'm 5' to expert. Simply remembers how you like things explained."],
] as const;

export default function FeaturesPage() {
  return (
    <InfoPage
      title="Features"
      eyebrow="Our product"
      heading="Everything you need to learn faster"
      description="YouTube is where the world learns. Simply turns any educational video into a tutor you can talk to and a study pack you can download."
    >
      <Features />
      <Block title="At a glance">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {more.map(([t, d]) => (
            <Card key={t} title={t}>{d}</Card>
          ))}
        </div>
      </Block>
    </InfoPage>
  );
}
