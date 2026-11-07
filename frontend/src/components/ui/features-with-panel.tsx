"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  AskVisual,
  VoiceVisual,
  WebVisual,
  ExportVisual,
  QuizVisual,
  LevelVisual,
} from "@/components/ui/feature-visuals";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionFrame } from "@/components/ui/section-frame";

interface FeatureItem {
  title: string;
  alt?: string;
  content: string | React.ReactNode;
}

function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-card text-card-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

function FeatureMedia({
  content,
  alt,
}: {
  content: string | React.ReactNode;
  alt?: string;
}) {
  if (typeof content !== "string") {
    return <div className="h-full w-full">{content}</div>;
  }

  const isVideo = /\.(mp4|webm|ogg)$/i.test(content);
  const isImage =
    /\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(content) ||
    /unsplash|images\./i.test(content);

  if (isVideo) {
    return (
      <video
        src={content}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
    );
  }

  if (isImage) {
    return (
      <img
        src={content}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <p className="text-sm leading-relaxed text-muted-foreground">{content}</p>
    </div>
  );
}

const items: FeatureItem[] = [
  {
    title: "Ask anything about the video.",
    alt: "Answers come from the lecture itself, with timestamps you can click to jump straight to the moment.",
    content: <AskVisual />,
  },
  {
    title: "Type it or just say it.",
    alt: "Use text or voice, and have answers read aloud. Study hands-free while you cook, commute or take notes.",
    content: <VoiceVisual />,
  },
  {
    title: "Go beyond the video with web search.",
    alt: "When the lecture doesn't cover it, Simply searches the web and keeps video and web sources clearly separate.",
    content: <WebVisual />,
  },
  {
    title: "Turn any lecture into docs, decks and sheets.",
    alt: "Generate Word notes, PowerPoint decks, Excel sheets and PDF cheat sheets built only from that video.",
    content: <ExportVisual />,
  },
  {
    title: "Quizzes and flashcards that make it stick.",
    alt: "Chapter-end quizzes with explanations, plus spaced-repetition flashcards you can export to Anki.",
    content: <QuizVisual />,
  },
  {
    title: "Explained at your level.",
    alt: "From 'like I'm 5' to expert. Simply remembers how you like things explained.",
    content: <LevelVisual />,
  },
];

export default function FeaturesWithPanel() {
  const [active, setActive] = React.useState(0);
  const DURATION = 6;

  return (
    <SectionFrame id="features">
      <SectionHeader
        eyebrow="Features"
        title="Everything you need to learn faster"
        description="YouTube is where the world learns. Simply turns any educational video into a tutor you can talk to and a study pack you can download."
      />
      <div className="px-5 pb-10 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>

            <ul className="flex flex-col gap-1">
              {items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.07,
                    ease: "easeOut",
                  }}
                  onClick={() => setActive(index)}
                  className={cn(
                    "relative flex cursor-pointer flex-col rounded-xl px-4 py-3.5 transition-all duration-200 lg:flex-row lg:items-center lg:gap-4",
                    active === index
                      ? "ring-1 ring-foreground"
                      : "ring-1 ring-transparent",
                  )}
                >
                  <div className="flex w-full flex-row items-center gap-4 lg:contents">
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors duration-200",
                        active === index
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={cn(
                        "text-lg font-medium tracking-[-0.01em] transition-colors duration-200",
                        active === index
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.title}
                    </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {active === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="w-full overflow-hidden lg:hidden"
                      >
                        <Card className="mt-3 aspect-[4/3] w-full">
                          <div className="absolute inset-0">
                            <FeatureMedia
                              content={item.content}
                              alt={item.alt}
                            />
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-4 bottom-1 h-[2px] overflow-hidden rounded-full bg-white/[0.07]"
                  >
                    {active === index && (
                      <motion.span
                        key={"p" + active}
                        className="block h-full origin-left rounded-full bg-foreground"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: DURATION, ease: "linear" }}
                        onAnimationComplete={() => setActive((i) => (i + 1) % items.length)}
                      />
                    )}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block">
            <Card className="aspect-[4/3] w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0"
                >
                  <FeatureMedia
                    content={items[active].content}
                    alt={items[active].alt}
                  />
                </motion.div>
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
