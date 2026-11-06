# Simply: Features

**Vision:** YouTube is where the world learns. Simply turns any educational YouTube video into an interactive tutor and a source of study material, without leaving the tab.

> Note: the original brief said users can "ask anything for the three waterfall". I read that as "ask anything about the video, for educational purposes". Correct this line if it meant something else.

---

## 1. Core features (what Simply offers today)

### 1.1 Ask anything about the video
- Questions are answered from the video itself: captions, chapters, title, description, channel context.
- Every answer cites timestamps. Clicking one jumps the player to that moment.
- Scope is educational: explain, summarize, quiz, compare, give examples, clarify a confusing step.
- **Text and voice**
  - Type in a chat box, or talk using a mic button / push-to-talk shortcut.
  - Answers can be read aloud (text-to-speech), with a speed control.
  - Hands-free mode lets you study while cooking, commuting or taking notes.

### 1.2 Web search (beyond the video)
- If the video doesn't cover something, Simply searches the web and says so.
- Answers keep video-sourced and web-sourced content visibly separate, each with its own citations.
- A toggle switches between "video only" and "video + web".

### 1.3 Create documents from the video
Generate files that come only from that video's content:

| Output | What you get |
|---|---|
| **Doc (.docx)** | Structured notes, chapter-wise summary, glossary |
| **Slides (.pptx)** | A deck built from the lecture's chapters, with key points and diagrams |
| **Sheet (.xlsx)** | Tables, formulas, comparisons, and data mentioned in the video |
| **PDF** | Clean cheat sheet, revision handout, printable notes |
| **Flashcards / quiz** | Q&A pairs exported to Anki / CSV |

- Pick a template and style (concise, detailed, exam-focused, ELI5).
- Each generated file links back to timestamps in the video.

### 1.4 Cleaned, trustworthy transcript (foundation)
- Removes `[Music]` noise and merges repeated lines.
- Splits the video by chapters.
- An AI pass fixes mis-heard technical terms using the title and summary.

---

## 2. Ideas to make Simply stand out

Grouped by effort, with the biggest differentiators first.

### Learn actively (retention, not just answers)
1. **Quiz me.** Auto-generated MCQs and short answers at each chapter end, with explanations and a score.
2. **Spaced repetition.** Flashcards from the video, scheduled for review (1 day, 3 days, 7 days) with reminders.
3. **Pause-and-check.** Simply pauses at key concepts and asks "what do you think happens next?" (optional).
4. **Feynman mode.** You explain the topic back; Simply finds the gaps and corrects them.
5. **Confusion detector.** Rewind the same section 3 times and Simply offers a simpler explanation.
6. **Study plan.** Paste a playlist or course; Simply builds a day-by-day schedule with goals.

### Understand deeper
7. **Explain at my level.** ELI5, high school, undergraduate, expert. Remembered per user.
8. **Visualise it.** Auto-built mind maps, concept graphs, timelines and flowcharts from the video.
9. **Diagram and formula reader (vision).** Read what's on the slide or whiteboard, not just what's spoken. This is the "Frames" feature already on the roadmap.
10. **Code playground.** For programming videos, extract code shown on screen into a runnable snippet.
11. **Worked-example generator.** "Give me 5 more problems like the one at 12:40" with step-by-step solutions.
12. **Prerequisite finder.** "You'll struggle here because you need X first," with links to short videos on X.

### Save time
13. **Smart skip.** Highlights the 20% of the video that matters; skip sponsors, intros and tangents.
14. **TL;DR in 30 seconds / 5 minutes / full.** Pick a depth.
15. **Chapter generator for videos with none.** AI-created chapters and titles.
16. **Key-moments bar.** Definitions, formulas and examples marked on the progress bar.
17. **Multi-video synthesis.** Select 3 videos on the same topic and get one merged, deduplicated note set, with disagreements flagged.

### Language and access
18. **Translate and dub.** Ask questions in any language about a video in another.
19. **Accessibility mode.** Dyslexia-friendly fonts, high-contrast, screen-reader-first answers.
20. **Offline notes.** Download the generated pack for flights and bad connections.

### Social and creator side
21. **Study rooms.** Watch together and share one note-taking doc.
22. **Public note pages.** Share a clean, searchable "notes for this lecture" link.
23. **Creator dashboard.** Shows teachers the timestamps where learners ask the most questions, which is real feedback on what confuses people.
24. **Course mode.** Turn a full playlist into a course: syllabus, progress tracking, final exam, certificate.

### Integrations
25. **Export to Notion, Google Docs, Obsidian, Anki.**
26. **Calendar sync** for study sessions and revision reminders.
27. **Mobile share-sheet.** Share a YouTube link to Simply and get notes back.

---

## 3. Suggested roadmap

| Phase | Ship | Why |
|---|---|---|
| **Now** | Q&A with timestamps (text), cleaned transcript | Core value |
| **Next** | Voice in/out, web search, PDF + docx export | Matches the current pitch |
| **Then** | pptx + xlsx export, quizzes, flashcards, explain-at-my-level | Makes it a study tool |
| **Later** | Frame / diagram understanding, mind maps, multi-video synthesis | Hard to copy |
| **Big bets** | Course mode, creator dashboard, study rooms | Growth and a second audience |

## 4. Guardrails
- Say clearly which answers are from the video and which from the web.
- Never present a guess as a quote; always link the timestamp.
- Respect YouTube terms and creator rights: generated files are for personal study and link back to the original video.
- Stay education-focused: politely decline off-topic requests.

## 5. Open questions
- Free vs paid limits: which exports are free?
- Voice provider and cost per minute?
- Which export formats come first (PDF + docx are the cheapest)?
- Do we store user notes, and under what privacy policy?
