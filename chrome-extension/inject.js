(function () {
    function isWatchPage() {
        return window.location.pathname === "/watch" && window.location.search.includes("v=");
    }

    const originalXHR = window.XMLHttpRequest.prototype.open;
    const originalFetch = window.fetch;
    let spaLastFetchedVideoId = null;

    function getVideoMetadata() {
        const vd = window.ytInitialPlayerResponse?.videoDetails;
        return {
            title: vd?.title || "",
            description: vd?.shortDescription || ""
        };
    }

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
                    title: metadata.title,
                    description: metadata.description,
                    body: rawText
                }
            })
        );
    }

    // Intercept YouTube's native timedtext XMLHttpRequest
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

    // Clean fetch interceptor strictly for timedtext
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

    window.addEventListener("yt-navigate-finish", () => {
        spaLastFetchedVideoId = null;
    });
})();