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

