function isWatchPage() {
    return window.location.pathname === "/watch" && window.location.search.includes("v=");
}

let lastSentVideoId = null;

function getFallbackDomMetadata() {
    let title = "";
    let description = "";

    try {
        const titleEl = document.querySelector("h1.ytd-watch-metadata yt-formatted-string, #title h1 yt-formatted-string, ytd-watch-metadata h1");
        if (titleEl && titleEl.textContent) {
            title = titleEl.textContent.trim();
        } else if (document.title) {
            title = document.title.replace(/ - YouTube$/, "").trim();
        }
    } catch (e) {}

    try {
        const descEl = document.querySelector("#description-inline-expander yt-attributed-string, #description yt-formatted-string, ytd-text-inline-expander#description-inline-expander");
        if (descEl && descEl.textContent) {
            description = descEl.textContent.trim();
        }
    } catch (e) {}

    return { title, description };
}

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

    const fallback = (!detail.title || !detail.description) ? getFallbackDomMetadata() : { title: "", description: "" };
    const title = detail.title || fallback.title || "";
    const description = detail.description || fallback.description || "";

    chrome.runtime.sendMessage({
        videourl: detail.sourceurl,
        trackurl: detail.trackurl || "",
        rawtext: detail.body,
        title: title,
        description: description
    });
});

window.addEventListener("yt-navigate-finish", () => {
    lastSentVideoId = null;
});