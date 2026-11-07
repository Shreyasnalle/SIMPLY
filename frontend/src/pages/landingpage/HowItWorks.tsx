import React from "react";
import { SectionFrame } from "@/components/ui/section-frame";
import InkOrbitFeatures from "@/components/ui/ink-orbit-features";

// How Simply works, told through the real pipeline:
// YouTube page -> extension -> backend cleaning -> AI caption correction.
export function HowItWorks() {
  return (
    <SectionFrame id="how-it-works">
      <InkOrbitFeatures
        theme="dark"
        bare
        brand="Simply"
        tag="How it works"
        title={"From a YouTube tab to\n*answers you can trust*"}
        team={[
          "Captions · read from the player",
          "Chapters · from the description",
          "Title · video context",
          "Channel · who is teaching",
          "Frames · coming soon",
        ]}
        reportLabel="LECTURE"
        connectedLabel="4 sources captured"
        collaboration={{
          title: "Captures the lecture as you watch",
          description:
            "The Simply extension quietly picks up the captions, title, channel and chapters of the video you open. No copy-pasting, no extra tabs.",
        }}
        reports={{
          title: "Cleaned into a tidy transcript",
          description:
            "Simply strips out noise like [Music], fixes timestamps, merges repeated lines and splits the video into its chapters, so every lecture is structured and ready to use.",
        }}
        integrations={{
          title: "Understands every kind of source",
          description:
            "Captions, chapter lists, descriptions and video details are combined into one picture of the lecture, instead of treating the transcript as plain text.",
          tools: ["Captions", "Chapters", "Details", "Search"],
        }}
        insights={{
          title: "Context-aware corrections",
          description:
            "An AI pass reads the title and summary of the video, then fixes mis-heard technical terms in the captions, so you get answers about what was actually taught.",
        }}
      />
    </SectionFrame>
  );
}

export default HowItWorks;
