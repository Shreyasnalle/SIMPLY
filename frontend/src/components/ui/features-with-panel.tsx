"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";

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
        "relative overflow-hidden rounded-2xl border border-white/10 bg-card text-card-foreground",
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
    title: "Copy & paste components, instantly.",
    alt: "Drop in fully-styled, accessible components with a single CLI command.",
    content:
      "https://cdn.21st.dev/assets/mirror/8c/8c4e18b6cde77ac53f3fa40ce7146594c03dd5fd0ebbd2adc9de141804a4d845.webm",
  },
  {
    title: "Install components & blocks via CLI.",
    alt: "Run a single command to add any component directly into your codebase — no package to manage.",
    content:
      "https://cdn.21st.dev/assets/mirror/25/25228e9cefa50f9db3c28b77375e51fb15fc5975d98a6fbe23dbeeb9e068395d.webm",
  },
  {
    title: "Tailwind-first styling you actually own.",
    alt: "No black-box CSS. The source lives in your project — tweak anything, anytime.",
    content:
      "https://cdn.21st.dev/assets/localized/bd5e2be5d76b2e4f1612e70510357cf6865869dfed81859c4fd7b597ca38b9a6.png",
  },
  {
    title: "Dark mode out of the box.",
    alt: "Theme switching with CSS variables. Light, dark, or fully custom — zero extra work.",
    content:
      "https://cdn.21st.dev/assets/mirror/16/167a5626e0c8f3aa59c25b5dc3324a2d0178bbec206084a4375f5363e29ade5f.webm",
  },
  {
    title: "Responsive by default, every time.",
    alt: "Every component adapts seamlessly across mobile, tablet, and desktop — no extra work needed.",
    content:
      "https://cdn.21st.dev/assets/mirror/6e/6eae938226ca5a8c25295b2f1a8cfee3d7e96db1445e63bdc7eff68309f95036.webm",
  },
];

export default function FeaturesWithPanel() {
  const [active, setActive] = React.useState(0);

  return (
    <section
      id="features"
      className="relative w-full scroll-mt-24 bg-background py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Features"
              title="Everything you need to learn faster"
              description="Pick a feature to see how Simply works inside your video tab."
              className="mb-10"
            />

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
                    "flex cursor-pointer flex-col rounded-xl px-4 py-3.5 transition-all duration-200 lg:flex-row lg:items-center lg:gap-4",
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
                        "text-sm font-medium transition-colors duration-200",
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
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="sticky top-28 hidden lg:block">
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
    </section>
  );
}
