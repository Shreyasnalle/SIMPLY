# INJECT (getting title, description and captions)

This document specifies the architecture, execution flow, and block-by-block implementation of `inject.js` inside the Chrome Extension.

---

## 1. Architectural Role & Execution Context

* **Execution World:** `MAIN` (defined in `manifest.json` under `content_scripts`).
* **Purpose:** Runs directly inside YouTube's native JavaScript execution context on `https://www.youtube.com/*`.
* **Why it must run in `MAIN`:**
  1. Standard extension content scripts run in an isolated world and cannot see or monkey-patch YouTube's internal `window.XMLHttpRequest` or `window.fetch` instances.
  2. Running in `MAIN` grants direct access to YouTube's native network calls (intercepting `timedtext` captions) and YouTube's in-memory data object (`window.ytInitialPlayerResponse.videoDetails`).
* **Boundary Communication:** Because extension APIs (`chrome.runtime`) are unavailable in `MAIN`, `inject.js` passes its data across to `content.js` (which runs in the `ISOLATED` world) via an in-memory DOM event (`CustomEvent`).

---

## 2. End-to-End Extraction Flow

```
[ User loads / watches YouTube video ]
                   │
                   ▼
  1. Watch Page Validation: isWatchPage()
     Verifies path is /watch and contains ?v=
                   │
                   ▼
  2. Network Interception: XMLHttpRequest / fetch
     Listens for YouTube's native network request containing "timedtext"
                   │
                   ▼
  3. Response Capture:
     Extracts caption payload (rawText) & request URL (trackurl)
                   │
                   ▼
  4. Metadata Retrieval: getVideoMetadata()
     Directly reads title and full description from window.ytInitialPlayerResponse.videoDetails
                   │
                   ▼
  5. Deduplication & Dispatch: dispatchCaptions()
     Checks spaLastFetchedVideoId to prevent duplicate submissions
     Fires window.dispatchEvent(new CustomEvent("captions intercepted", { detail }))
                   │
                   ▼
  [ Handed over to content.js via shared DOM ]
```

---

## 3. Code Blocks & Detailed Breakdown

### 3.1. IIFE Wrapper & State Initialization
```javascript
(function () {
    function isWatchPage() {
        return window.location.pathname === "/watch" && window.location.search.includes("v=");
    }

    const originalXHR = window.XMLHttpRequest.prototype.open;
    const originalFetch = window.fetch;
    let spaLastFetchedVideoId = null;
    ...
})();
```
* **Immediately Invoked Function Expression (IIFE):** Encapsulates all logic in a private scope to prevent polluting or clashing with YouTube's global variables.
* **`isWatchPage()`:** Restricts execution strictly to active watch pages (`/watch?v=...`), ignoring home (`/`), shorts (`/shorts`), search, and channel pages.
* **Preserving Originals (`originalXHR`, `originalFetch`):** Stores un-tampered references to native browser network methods before wrapping them, ensuring YouTube's player functions normally without breaking playback.
* **`spaLastFetchedVideoId`:** Deduplication cache. Tracks the currently ingested video ID so multiple subtitle chunk requests do not trigger repeated dispatches.

---

### 3.2. Metadata Extraction (`getVideoMetadata`)
```javascript
function getVideoMetadata() {
    const vd = window.ytInitialPlayerResponse?.videoDetails;
    return {
        title: vd?.title || "",
        description: vd?.shortDescription || ""
    };
}
```
* **Source:** Reads strictly from `window.ytInitialPlayerResponse.videoDetails`.
* **Extracted Fields:**
  * `title`: Video headline.
  * `description`: The complete, un-truncated video description (`shortDescription`) containing all text, chapter timestamps, links, and hashtags without requiring UI expansion.
* **No Speculative Bloat:** All DOM scraping fallbacks, player API hacks, and regex parsing are eliminated; the raw data is captured directly from source.

---

### 3.3. Caption Dispatcher (`dispatchCaptions`)
```javascript
function dispatchCaptions(videoUrl, trackUrl, rawText) {
    if (!rawText || rawText.length < 30) return;
    const videoIdMatch = videoUrl.match(/[?&]v=([^&]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    if (!videoId) return;

    spaLastFetchedVideoId = videoId;
    const metadata = getVideoMetadata();

    window.dispatchEvent(
        new CustomEvent("captions intercepted", {
            detail: {
                sourceurl: `https://www.youtube.com/watch?v=${videoId}`,
                trackurl: trackUrl || "",
                body: rawText,
                title: metadata.title,
                description: metadata.description
            }
        })
    );
}
```
* **Guard Clauses:** Ignores empty or malformed payloads (`rawText.length < 30`) and extracts the video ID.
* **Payload Packaging:** Gathers the intercepted captions, the video URL, the caption track URL, the title, and the description into one consolidated bundle.
* **The Bridge:** Emits a native DOM `CustomEvent("captions intercepted")` on the `window` target, safely delivering clean structured data to `content.js`.

---

### 3.4. XMLHttpRequest Interceptor
```javascript
window.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.addEventListener("load", function () {
        if (!isWatchPage()) return;
        const urlStr = url ? url.toString() : "";
        if (urlStr.includes("timedtext")) {
            try {
                const rawText = this.responseText;
                const currentVideoId = new URLSearchParams(window.location.search).get("v");
                const videoUrl = `https://www.youtube.com/watch?v=${currentVideoId}`;
                dispatchCaptions(videoUrl, urlStr, rawText);
            } catch (err) {}
        }
    });
    return originalXHR.apply(this, [method, url, ...rest]);
};
```
* **Primary Caption Channel:** Desktop YouTube loads subtitle tracks via `XMLHttpRequest` requesting URLs containing `timedtext`.
* **Execution:** Intercepts `open()`, attaches a `load` event listener, and upon successful completion, extracts `this.responseText` and triggers `dispatchCaptions()`.
* **Transparency:** Calls `originalXHR.apply()` to ensure the browser and player proceed without interruption.

---

### 3.5. Fetch Interceptor (Safety Fallback)
```javascript
window.fetch = async function (...args) {
    const response = await originalFetch(...args);
    if (isWatchPage()) {
        const urlStr = args[0] ? args[0].toString() : "";
        if (urlStr.includes("timedtext")) {
            try {
                const cloned = response.clone();
                const rawText = await cloned.text();
                const currentVideoId = new URLSearchParams(window.location.search).get("v");
                const videoUrl = `https://www.youtube.com/watch?v=${currentVideoId}`;
                dispatchCaptions(videoUrl, urlStr, rawText);
            } catch (err) {}
        }
    }
    return response;
};
```
* **Purpose:** Handles YouTube player variants or Chromium experiments that fetch subtitles via `window.fetch` instead of `XMLHttpRequest`.
* **Stream Safety (`response.clone()`):** Clones the response before reading `.text()` to prevent consuming the stream, avoiding `"body stream already read"` errors in YouTube's native player.

---

### 3.6. SPA Navigation Handler
```javascript
window.addEventListener("yt-navigate-finish", () => {
    spaLastFetchedVideoId = null;
});
```
* **Purpose:** YouTube does not trigger a full page reload when a user clicks a recommended video; it dispatches `yt-navigate-finish`.
* **Action:** Resets `spaLastFetchedVideoId` so that caption interception and metadata collection immediately activate for the newly loaded video.

---

## 4. CONTENT (bridging intercepted events to the extension runtime)

This section specifies the implementation of `content.js`.

### 4.1. Execution Context
* **Execution World:** `ISOLATED` (default content script world).
* **Role:** Acts strictly as the secure event bridge between the page DOM and Chrome's extension messaging bus (`chrome.runtime`).
* **Design Rule:** No DOM scraping, no redundant fallbacks, and no data transformations. It strictly forwards what `inject.js` captured.

### 4.2. Implementation & Flow
```javascript
function isWatchPage() {
    return window.location.pathname === "/watch" && window.location.search.includes("v=");
}

let lastSentVideoId = null;

window.addEventListener("captions intercepted", (event) => {
    if (!isWatchPage()) return;

    const detail = event.detail;
    if (!detail || !detail.body || detail.body.length < 30) return;

    const vidMatch = (detail.sourceurl || "").match(/[?&]v=([^&]+)/);
    const videoId = vidMatch ? vidMatch[1] : null;

    if (videoId && videoId === lastSentVideoId) {
        return;
    }
    if (videoId) lastSentVideoId = videoId;

    chrome.runtime.sendMessage({
        videourl: detail.sourceurl,
        trackurl: detail.trackurl || "",
        title: detail.title || "",
        description: detail.description || "",
        rawtext: detail.body
    });
});

window.addEventListener("yt-navigate-finish", () => {
    lastSentVideoId = null;
});
```

### 4.3. Breakdown of Responsibilities
1. **Watch Page Validation:** Guards against processing events outside `/watch?v=...`.
2. **Event Listener (`captions intercepted`):** Catches the custom DOM event dispatched across the world boundary by `inject.js`.
3. **Deduplication Gate (`lastSentVideoId`):** Ensures that multiple caption events for the same video are not forwarded repeatedly to the background worker.
4. **Clean Handoff:** Packages `{ videourl, trackurl, title, description, rawtext }` and dispatches via `chrome.runtime.sendMessage()`.
5. **SPA Reset:** Resets `lastSentVideoId` on `yt-navigate-finish` when the user transitions to another video.

---

## 5. VIDEO INGESTION FOR RAG (Two-Tier Progressive Visual Pipeline)

This section specifies how video visual context is captured for RAG without downloading full video streams, avoiding heavy server compute, high network bandwidth, and long ingestion latency.

### 5.1. Design Principles
1. **Captions/audio are the primary text source (Tier 1).** Storyboard sprites are too low-resolution (roughly 48x27 to 320x180 per frame, sampled every few seconds) for OCR, code or math. They are never used for text extraction.
2. **The live frame is the only visual-text source (Tier 2).** Visual text (code, LaTeX, slide text, diagram labels) comes only from full-resolution canvas frames of what the user is actually watching.
3. **Cheap gates come first, expensive ones last.** Client-side hash gate → rate limit → backend VLM → decision agent → DB write.
4. **No video stream downloads.** No `yt-dlp`, no server-side transcoding, no ingestion latency.

---

### 5.2. Tier 1: Caption-Driven Baseline Chunks (Global Ingestion)

![Tier 1 flow: browser to backend, storyboard chunk API, extraction, validation, transformation and chunking](../assets/tier1_flow.png)

*Flow: `browser → (audio + storyboard + contextual info) → backend → [storyboard chunk API] → extraction + deserialization + validation + transformation (Redis) → chunking`*

* **Trigger:** Once per video, on page load, from the `captions intercepted` flow (`inject.js → content.js → background.js`).
* **Payload:** captions (audio text), storyboard metadata from `window.ytInitialPlayerResponse.storyboards`, title, description (including chapter timestamps), and the video URL.
* **Backend processing (Redis queue worker):**
  * The endpoint does light schema/size validation, enqueues a job and returns `202 Accepted` with a `job_id`, so other API requests are never blocked.
  * The worker performs extraction, deserialization, validation, transformation and then chunking of the entire video (0:00 to end).
  * Chunks are embedded and stored (text/metadata in Supabase Postgres, vectors alongside).
* **Chunk formation:**
  * Boundaries come from caption sentence and pause boundaries, optionally aligned to storyboard scene changes (hashing adjacent sprite tiles), so each chunk is one coherent idea.
  * Chunk text is the audio text, with title, description and chapter context attached.
  * Storyboards contribute only light metadata: scene boundaries and a coarse `visual_type` (slide / code / diagram / talking head). This is also used to prioritize Tier 2 capture.
* **Idempotency:** Job IDs are deterministic (`video_id`) so retries never create duplicate chunks. Chunk identity is `(video_id, chunk_index)` with `t_start` and `t_end`.
* **Limitations:** Videos with no or poor captions produce weak Tier 1 chunks. They should be flagged `low_text` so Tier 2 carries more weight.

---

### 5.3. Tier 2: Live Frame Watcher (Hash-Gated Progressive Enhancement)

![Tier 2 flow: hash comparison, canvas frame, backend, VLM extraction, agent comparison against the Postgres chunk, update or skip](../assets/tier2_flow.png)

*Flow: `browser → compare hash values → (no: no changes) / (yes: canvas frame) → backend [modification chunk API] → VLM extraction → agent (reads that timeframe's chunk from Postgres, not the vector DB, and compares) → update that chunk / do not update that chunk`*

#### 5.3.1. Extension side (`content.js`): Frame Watcher
* **Source:** The browser's active `<video>` element.
* **Local sampling (cheap, no network):** While the video is **playing** and the tab is **visible**, sample a tiny downscaled frame every 2 to 5 seconds and compute a perceptual hash (e.g. dHash on an 8x8 / 9x8 grayscale copy; comparing 64 bits takes under 1 ms).
* **Gate 1: hash comparison:**
  * Compare against the hash of the **last frame sent**, not the last frame sampled. This lets slow, incremental changes (a slide building up line by line) eventually cross the threshold.
  * Difference below threshold means the same slide or scene: **no changes, nothing is sent**.
  * Difference at or above threshold means a candidate change.
  * Bias the threshold toward sending. A missed change loses content permanently, while an extra send costs only a little compute.
* **Settle check:** Before capturing, require two consecutive samples to match (about 1 s apart) so mid-transition or mid-animation frames are not sent.
* **Seeks:** After a seek, wait for a short debounce (about 1 s) and then always send the first frame. The previous baseline is no longer relevant.
* **Rate limit:** At most one send per **30 seconds**. This is a minimum gap between sends, not a fixed polling interval.
* **Capture:**
  ```javascript
  canvas.getContext('2d').drawImage(video, 0, 0);
  ```
  Only the `<video>` element is drawn, never the surrounding page. Compress (e.g. JPEG) before sending without destroying text legibility.
* **Payload:** `{ video_id, timestamp, sequence_number, frame }`. The sequence number lets the backend discard stale or out-of-order patches.
* **Guards:** Skip if the frame is black (e.g. DRM-tainted canvas), if the video is paused, or if the tab is hidden.

#### 5.3.2. Backend side: Modification Chunk API + Worker
The endpoint validates and enqueues, returning `202`. A Redis queue worker runs the following steps, taking a **per-video lock** so only one patch job per video runs at a time:
1. **Map timestamp to chunk:** Resolve `timestamp` to exactly one chunk `(video_id, chunk_index)`. Frames on a boundary map by a fixed rule.
2. **VLM extraction:** Run the VLM on the full-resolution frame with a prompt tuned for code, LaTeX, slide text and diagram labels. Discard empty, refused or non-informative results (talking head, black frame).
3. **Gate 2: decision agent:**
   * The agent loads **only that timeframe's chunk from Postgres (Supabase), not from the vector DB**.
   * It compares the new VLM text against the chunk's audio text and previously stored visual text.
   * It answers whether the new text adds meaningful information (code, math, diagram detail) or is a duplicate or noise.
   * It returns strict JSON:
     ```json
     { "update_required": true, "reason": "New LaTeX formula not present in stored chunk" }
     ```
   * **Cheap pre-check:** If text similarity to the existing visual text is above a high threshold, skip without calling the agent.
   * **Fail open:** If the agent errors, update. Never lose an upgrade due to an agent failure.
   * **Bias:** Lean toward updating when the new text contains code, equations, or notably more content.
   * Every verdict is logged so the skip rate and sampled skips can be audited.
4. **If `update_required` is false:** End the job. No merge, no re-embedding, no DB write.
5. **If `update_required` is true:** Add the new VLM text to the chunk's frame results, rebuild `final_text` (audio text + visual text), re-embed, and update the Supabase row.

#### 5.3.3. Chunk Record (Supabase Postgres)
| Column | Purpose |
|---|---|
| `video_id`, `chunk_index`, `t_start`, `t_end` | Identity (unique constraint) |
| `audio_text` | Caption text for the window (set in Tier 1, never changed) |
| `vlm_text` | Merged visual text from Tier 2 frames. A chunk can hold **multiple frame results**, which are appended and merged, never overwritten, so a second slide in the same chunk does not replace the first. |
| `visual_type` | Coarse type from Tier 1 (slide / code / diagram / talking head) |
| `final_text` | `audio_text` merged with `vlm_text`. This is what gets embedded. |
| `embedding` | Vector for `final_text` |
| `version`, `updated_at`, `last_sequence` | Ordering, stale-patch rejection and idempotency |

---

### 5.4. Cost and Safety Controls
* **Per-video patch cap** and per-user rate limit, so a flashing or animated video cannot run up the VLM bill. The VLM call is the dominant cost.
* **Stale-patch guard:** Ignore patches whose `sequence_number` is not newer than `last_sequence`.
* **Re-embed only when `final_text` actually changes.**
* **Not-yet-processed chunks:** The assistant should degrade gracefully (answer from audio text and optionally indicate visual details are still processing).
* **Privacy:** Only the video element is captured. No page overlays, comments or other content.

---

### 5.5. Core Problems Solved
1. **Zero video stream downloads:** No 300MB+ downloads, no bot-IP blocking risk, no server transcoding.
2. **Zero ingestion latency:** Tier 1 chunks are built immediately from captions without blocking the user.
3. **Minimal redundant work:** The client hash gate, 30 s rate limit and backend decision agent keep network, VLM calls, queue jobs, DB writes and re-embeddings low.
4. **Progressive quality:** Watched segments gain high-fidelity visual text over time. Unwatched segments rely on captions only. This is an accepted limit, because visual text for unplayed sections is not available.


