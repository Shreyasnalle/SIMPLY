import re
from typing import Any, Dict, Optional
from urllib.parse import parse_qs, urlparse


def _parse_time(time_value: str) -> float:
    try:
        value = time_value.lower().rstrip("s")
        if "m" in value:
            minutes, seconds = value.split("m", 1)
            return float(minutes) * 60.0 + (float(seconds) if seconds else 0.0)
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def extract_videourl(videourl: str) -> Dict[str, Any]:
    if not isinstance(videourl, str) or not videourl.strip():
        return {"videourl": "", "video_id": None, "start_time": 0.0}

    videourl = videourl.strip()
    parsed = urlparse(videourl)
    video_id: Optional[str] = None
    start_time = 0.0

    if parsed.hostname in {"www.youtube.com", "youtube.com", "m.youtube.com"}:
        if parsed.path == "/watch":
            query = parse_qs(parsed.query)
            video_id = query.get("v", [None])[0]
            if query.get("t"):
                start_time = _parse_time(query["t"][0])
        elif parsed.path.startswith(("/embed/", "/v/")):
            video_id = parsed.path.split("/")[2]
    elif parsed.hostname == "youtu.be":
        video_id = parsed.path.lstrip("/").split("?")[0]
        query = parse_qs(parsed.query)
        if query.get("t"):
            start_time = _parse_time(query["t"][0])

    if not video_id:
        match = re.search(r"(?:v=|/)([0-9A-Za-z_-]{11})", videourl)
        if match:
            video_id = match.group(1)

    canonical_url = (
        f"https://www.youtube.com/watch?v={video_id}" if video_id else videourl
    )
    return {
        "videourl": videourl,
        "video_id": video_id,
        "canonical_url": canonical_url,
        "start_time": start_time,
    }
