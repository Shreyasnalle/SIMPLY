const API_BASE = 'https://simply-kwrn.onrender.com';

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

async function handleLiveFrameUpdate(data) {
    try {
        await fetch(`${API_BASE}/api/frame-update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                videourl: data.videourl,
                timestamp: data.timestamp,
                image_data: data.image_data
            })
        });
    } catch (err) {}
}

async function handleContextData(data) {
    let contextResult;
    try {
        const res = await fetch(`${API_BASE}/api/captions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                videourl: data.videourl,
                trackurl: data.trackurl || '',
                channel_name: data.channel_name || '',
                title: data.title || '',
                description: data.description || '',
                storyboard_spec: data.storyboard_spec || '',
                rawtext: data.rawtext
            })
        });

        if (!res.ok) return;
        contextResult = await res.json();
    } catch (err) {
        return;
    }

    if (!contextResult || contextResult.status !== 'success' || !contextResult.video_id) {
        return;
    }

    const videoId = contextResult.video_id;
    const videoUrl = contextResult.video_url;

    await chrome.storage.local.set({
        current_video_id: videoId,
        current_video_url: videoUrl
    });

    try {
        await fetch(`${API_BASE}/api/ingest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ video_url: videoUrl, file_id: videoId })
        });
    } catch (err) {}
}