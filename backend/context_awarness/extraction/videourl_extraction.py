import re
from typing import Any, Dict, Optional
from urllib.parse import parse_qs, urlparse


_TIME_PATTERN = re.compile(r"(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?")


def _parse_time(time_value: str) -> float:
    match = _TIME_PATTERN.fullmatch(time_value.lower())
    if not match:
        return 0.0
    hours, minutes, seconds = (int(part or 0) for part in match.groups())
    return float(hours * 3600 + minutes * 60 + seconds)


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

    return {"videourl": videourl, "video_id": video_id, "start_time": start_time}
