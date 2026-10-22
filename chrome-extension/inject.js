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
            channel_name: vd?.author || "",
            title: vd?.title || "",
            description: vd?.shortDescription || ""
        };
    }

    function dispatchCaptions(videoUrl, rawText) {
        if (!rawText || rawText.length < 30) return;
        const videoIdMatch = videoUrl.match(/[?&]v=([^&]+)/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;
        if (!videoId || spaLastFetchedVideoId === videoId) return;

        spaLastFetchedVideoId = videoId;
        const metadata = getVideoMetadata();

        window.dispatchEvent(
            new CustomEvent("captions intercepted", {
                detail: {
                    videourl: videoUrl,
                    channel_name: metadata.channel_name,
                    title: metadata.title,
                    description: metadata.description,
                    rawtext: rawText
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
                    dispatchCaptions(window.location.href, rawText);
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
                    dispatchCaptions(window.location.href, rawText);
                } catch (err) {}
            }
        }
        return response;
    };

    window.addEventListener("yt-navigate-finish", () => {
        spaLastFetchedVideoId = null;
    });
})();