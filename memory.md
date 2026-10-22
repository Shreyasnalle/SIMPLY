# Simply: Working Memory

Reference for the current, final state of the ingestion path: **Chrome extension → backend extraction → cleaned output**. Verified end to end on 2026-10-23 (real FastAPI server, real `inject.js` / `content.js` / `background.js` run against a mocked browser).

All time values anywhere in this path are **seconds** (floats). Never ms, m or h.

---

## 1. Data flow at a glance

```
YouTube page
  └─ inject.js (MAIN world)            intercepts timedtext, reads videoDetails
       │  CustomEvent "captions intercepted"
       ▼
  content.js (ISOLATED world)          gates + forwards
       │  chrome.runtime.sendMessage  {type: INITIAL_VIDEO_DATA, ...5 fields}
       ▼
  background.js (service worker)       serializes (JSON.stringify) + POSTs
       │  POST /api/captions
       ▼
  main.py (FastAPI)                    Pydantic model → dict
       ▼
  cleaning.clean_context_pipeline
       ├─ deserialization.deserialize_video_context   (JSON/bytes/dict → dict, required keys)
       ├─ extraction.extract_context                  (videourl / description / rawtext parsing)
       └─ cleaning.validation_and_transformation      (final shape)
       ▼
  JSON response: videourl, video_id, channel_name, total_duration, chapters, captions
```

---

## 2. Chrome extension (`chrome-extension/`)

Principle: the extension only **captures and forwards**. No parsing of captions, no chapter extraction, no URL parsing, no description filtering. Interpretation is the backend's job.

### `inject.js` (world: MAIN, `document_start`)
- Wraps `XMLHttpRequest.prototype.open` and `window.fetch`. On a watch page (`/watch?v=…`), when a request URL contains `timedtext`, it takes the response body as `rawText` (fetch response is `clone()`d first).
- Reads from `window.ytInitialPlayerResponse.videoDetails`: `title`, `author` (→ `channel_name`), `shortDescription` (→ `description`, sent **whole and unfiltered**).
- `dispatchCaptions(videoUrl, rawText)` guards: `rawText` non-empty and ≥ 30 chars; video id present in the URL; not equal to `spaLastFetchedVideoId` (dedupe).
- Fires `CustomEvent("captions intercepted", { detail })` with exactly:
  `{ videourl, channel_name, title, description, rawtext }`
  - `videourl` = **raw `window.location.href`** (may include `&list=`, `&t=`).
  - `rawtext` = the body exactly as YouTube returned it.
- Resets the dedupe id on `yt-navigate-finish` (SPA navigation).

### `content.js` (world: ISOLATED, `document_start`)
- Caption path: listens for `captions intercepted`; requires watch page, `rawtext` ≥ 30 chars, and a video id not already sent (`lastSentVideoId`). Forwards via
  `chrome.runtime.sendMessage({ type: "INITIAL_VIDEO_DATA", videourl, channel_name, title, description, rawtext })`. No transformation, only `|| ""` defaults.
- Frame path (separate, not part of the caption flow): grabs a canvas JPEG (quality 0.8) of `video.html5-main-video` on `seeked` and every 10 s while playing, at least 5 s apart. Sends `{ type: "LIVE_FRAME_UPDATE", videourl (canonical, rebuilt from the id), timestamp, image_data }`.
- Resets `lastSentVideoId` / `lastSentFrameTime` on `yt-navigate-finish`.

### `background.js` (service worker)
- **Serialization happens here**: `postToBackend` does `JSON.stringify(payload)` and POSTs with `Content-Type: application/json`. Tries `http://localhost:8000`, then `https://simply-kwrn.onrender.com`.
- `INITIAL_VIDEO_DATA` → saves `current_video_id` / `current_video_url` to `chrome.storage.local`, dedupes per video id (in-memory `Set`, lost if the worker sleeps), POSTs the five fields to `/api/captions`.
- `LIVE_FRAME_UPDATE` → POSTs to `/api/frame-update`.
- After `/api/captions` responds, it only proceeds if `status === 'success'` and `video_id` exist (see Open items).

`popup.js` / `popup.html` / `popup.css`: login + chat UI; not part of ingestion.

---

## 3. Backend (`backend/`)

### `main.py`
- `POST /api/captions` and `POST /api/context` (same handler). Body model `VideoContextPayload`: `videourl` (required), `rawtext` (required), `channel_name`, `channelname`, `title`, `description` (optional, default `""`). Handler runs `clean_context_pipeline(payload.model_dump())`; any exception → HTTP 400. Missing required fields → 422.
- `POST /api/frame-update` is a stub: echoes `{status, videourl, timestamp}`.
- `GET /` and `GET /health` → `{"status": "ok", "service": "simply-backend"}`.
- CORS allows the Vercel app, youtube.com, localhost, and `chrome-extension://*`.

### `context_awarness/deserialization.py`
- `deserialize_json(raw)`: one `json.loads`; invalid JSON, bad UTF-8 bytes, or `None` all raise `ValueError("Invalid JSON payload: …")`.
- `_deserialize(payload, required)`: accepts `str | bytes | dict`; result must be a JSON object; raises `ValueError` listing missing keys.
- `deserialize_video_context` requires `videourl, rawtext, channel_name, title, description`.
- `deserialize_frame_context` requires `videourl, timestamp, image_data` (not wired into any endpoint yet).

### `context_awarness/extraction/` (parsing only; three field extractors + an orchestrator)

**`videourl_extraction.extract_videourl(url)`** → `{ videourl, video_id, canonical_url, start_time }`
- Handles `youtube.com/watch?v=`, `/embed/`, `/v/`, `youtu.be/`, and falls back to an 11-char id regex (`/live/`, `/shorts/`).
- `canonical_url` = `https://www.youtube.com/watch?v=<id>`; extra params (`list`, `index`) dropped.
- `start_time` (seconds) parsed from `t=`: supports `90`, `45s`, `1m5s`, `1h2m3s`, `1h`; garbage → `0.0`.
- Empty/invalid URL → `{ videourl: "", video_id: None, canonical_url: "", start_time: 0.0 }`.

**`description_extraction.extract_description(text)`** → `{ description, chapters }`
- A chapter line is a line **starting** with `m:ss` or `h:mm:ss`, optionally preceded by bullets/brackets and followed by separators: `0:00 Intro`, `- 1:05 Setup`, `(3:00) Outro`, `[4:00] Q&A`, `2:10 - Closing`, `5:00: Wrap`.
- Prose mentioning a time (`see 5:30 for more`), a bare timestamp with no title, and timestamps inside URLs are **not** chapters and stay in the description.
- `chapters` = `[{ chapter_name, start }]` with `start` in seconds (`1:02:03` → `3723.0`). `description` = text with chapter lines removed.

**`rawtext_extraction.extract_rawtext(raw)`** → `[{ text, start, end }]`
- JSON3 (`events[].segs[].utf8`, `tStartMs`, `dDurationMs`, ms ÷ 1000), XML srv3 `<p t d>` (ms ÷ 1000), XML legacy `<text start dur>` (already seconds), plain-text lines (all `0.0`).
- Text is HTML-unescaped and whitespace-normalized; events with empty text are skipped. Parse errors → `[]`.

**`extraction.extract_context(data)`** → `{ videourl: {…}, description: {…}, rawtext: [...], channel_name, title }`
- `channel_name` = `channel_name` or, if empty, `channelname`.
- Returns the parsed pieces as-is, with no noise filtering and no duration logic.

### `context_awarness/cleaning.py` (final output)
`clean_context_pipeline(payload)` = `deserialize_video_context` → `extract_context` → `validation_and_transformation`.

**Response shape (`/api/captions`):**
```json
{
  "videourl": "https://www.youtube.com/watch?v=<id>",
  "video_id": "<id>",
  "channel_name": "...",
  "total_duration": 5410.0,
  "chapters": [ { "start": 0.0, "end": 65.0, "chapter_name": "Intro" } ],
  "captions": [ { "start": 4.0, "end": 9.0, "caption": "Welcome to this course on CORS" } ]
}
```
- `chapters` and `captions` are **lists of dicts**, one dict per entry.
- `captions`: YouTube's text (entities decoded, whitespace flattened), with whole non-speech entries `[Music]` / `[Applause]` dropped and empty text skipped.
- `total_duration` = end time of the last caption (seconds, rounded to 3 dp). It is **not** the video's true length. `0.0` if there are no captions.
- `chapters`: sorted by `start`; each `end` = next chapter's `start`; last chapter's `end` = `max(total_duration, its start)`. No chapters in the description → `[]`.
- `title`, `description` and `start_time` are parsed but **not returned**.

---

## 4. Verified behaviours (2026-10-23)
- Real server + real extension scripts: one event per video even when the XHR fires twice; `rawtext` byte-identical to YouTube's body; backend returned `200` with the shape above.
- JSON3, XML srv3, XML legacy all yield seconds; `1:02:03` → `3723.0`; `t=1h2m3s` → `3723.0`.
- `/api/captions` and `/api/context` return identical results; missing `rawtext` → `422`; no chapters/captions → empty lists and `total_duration: 0.0`.

---

## 5. Open items
1. `background.js` expects `status` and `video_url` in the `/api/captions` response; the response has neither, so it returns early and `current_video_url` stays the raw URL (with `&t=`, `&list=`). Fix: have `background.js` read `video_id` / `videourl` from the new shape.
2. `total_duration` is the last caption's end. For the real video length, pass `videoDetails.lengthSeconds` from `inject.js` as an extra field. Chapters ending at the final caption would then be exact.
3. `backend/plan.md` and `chrome-extension/spec.md` still describe older shapes and file names (`extracting.py`, `detail.body`, `title` on chapters, 2-arg vs 3-arg `dispatchCaptions`, missing `assets/tier*_flow.png`).
4. Frame watcher is still a timer, not the specced dHash gate / settle check / 30 s rate limit / sequence numbers. `/api/frame-update` is a stub.
5. `background.js` dedupe `Set` does not survive MV3 service-worker sleep.

---

## 6. Standing rules (from `backend/spec.md` / `plan.md`)
- Backend code only inside `context_awarness/`, `other_videos/{long_video,short_video}/`, `mathematical/`; `live_streaming/` is frozen.
- Stack: Python, FastAPI, LangChain/LangGraph, Groq, Hugging Face (`BAAI/bge-small-en-v1.5`), Supabase + pgvector.
- Minimal code: no stray prints, no bloated comments, no speculative fallbacks.
- Roadmap order: Phase 1 (common pipeline) → Phase 2 (caption correction agent, semantic chunking, Supabase insert) → Phase 3 (frame ingestion, decision/synthesis agents) → Phase 4 (routing, hierarchical RAG, CRAG, Self-RAG). Do not start Phase 4 before Phases 1–3 are approved.
