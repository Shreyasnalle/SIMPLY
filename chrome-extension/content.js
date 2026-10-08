function isWatchPage() {
    return window.location.pathname === "/watch" && window.location.search.includes("v=");
}

let lastSentVideoId = null;
let lastSentFrameTime = -1;

function captureCurrentFrame() {
    const video = document.querySelector("video.html5-main-video");
    if (!video || !video.videoWidth || !video.videoHeight) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return {
        timestamp: video.currentTime,
        imageData: canvas.toDataURL("image/jpeg", 0.8)
    };
}

function sendLiveFrameUpdate() {
    if (!isWatchPage()) return;
    const frame = captureCurrentFrame();
    if (!frame) return;

    if (Math.abs(frame.timestamp - lastSentFrameTime) < 5.0) return;
    lastSentFrameTime = frame.timestamp;

    const currentVideoId = new URLSearchParams(window.location.search).get("v");
    if (!currentVideoId) return;

    chrome.runtime.sendMessage({
        type: "LIVE_FRAME_UPDATE",
        videourl: `https://www.youtube.com/watch?v=${currentVideoId}`,
        timestamp: frame.timestamp,
        image_data: frame.imageData
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_CURRENT_FRAME") {
        sendResponse(captureCurrentFrame());
    } else if (message.type === "SEND_FRAME_UPDATE") {
        sendLiveFrameUpdate();
        sendResponse({ ok: true });
    }
});

// Sample when user seeks to a new timestamp
document.addEventListener("seeked", (e) => {
    if (e.target && e.target.tagName === "VIDEO") {
        sendLiveFrameUpdate();
    }
}, true);

// Periodic sampling during normal video playback (every 10 seconds)
setInterval(() => {
    const video = document.querySelector("video.html5-main-video");
    if (video && !video.paused && !video.ended) {
        sendLiveFrameUpdate();
    }
}, 10000);

// Listen for the initial one-time video metadata and captions from inject.js
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
        type: "INITIAL_VIDEO_DATA",
        videourl: detail.sourceurl,
        trackurl: detail.trackurl || "",
        channel_name: detail.channel_name || "",
        title: detail.title || "",
        description: detail.description || "",
        storyboard_spec: detail.storyboard_spec || "",
        rawtext: detail.body
    });
});

window.addEventListener("yt-navigate-finish", () => {
    lastSentVideoId = null;
    lastSentFrameTime = -1;
});