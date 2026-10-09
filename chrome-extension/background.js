const BACKEND_URLS = ['http://localhost:8000', 'https://simply-kwrn.onrender.com'];

const ingestedVideoIds = new Set();

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.type === 'INITIAL_VIDEO_DATA' || (data.videourl && data.rawtext)) {
        const vidMatch = (data.videourl || '').match(/[?&]v=([^&]+)/);
        const videoId = vidMatch ? vidMatch[1] : null;

        if (videoId && ingestedVideoIds.has(videoId)) {
            return false;
        }

        if (videoId) ingestedVideoIds.add(videoId);

        handleContextData(data).catch(() => {});
        return false;
    }

    if (data.type === 'LIVE_FRAME_UPDATE') {
        handleLiveFrameUpdate(data).catch(() => {});
        return false;
    }

    return false;
});

async function postToBackend(endpoint, body) {
    for (const base of BACKEND_URLS) {
        try {
            const res = await fetch(`${base}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (res.ok) return { res, base };
        } catch (err) {}
    }
    return null;
}

async function handleLiveFrameUpdate(data) {
    await postToBackend('/api/frame-update', {
        videourl: data.videourl,
        timestamp: data.timestamp,
        image_data: data.image_data
    });
}

async function handleContextData(data) {
    const payload = {
        videourl: data.videourl,
        trackurl: data.trackurl || '',
        channel_name: data.channel_name || '',
        title: data.title || '',
        description: data.description || '',
        storyboard_spec: data.storyboard_spec || '',
        rawtext: data.rawtext
    };

    const postResult = await postToBackend('/api/captions', payload);
    if (!postResult || !postResult.res) return;

    let contextResult;
    try {
        contextResult = await postResult.res.json();
    } catch (err) {
        return;
    }

    if (!contextResult || contextResult.status !== 'success' || !contextResult.video_id) {
        return;
    }

    const videoId = contextResult.video_id;
    const videoUrl = contextResult.video_url || data.videourl;

    await chrome.storage.local.set({
        current_video_id: videoId,
        current_video_url: videoUrl
    });
}