import re
from urllib.parse import urlparse, parse_qs
from typing import Dict, Any, Optional

def extractingurl(url: str) -> Dict[str, Any]:
    if not url:
        return {"video_id": None, "canonical_url": "", "start_time": 0.0}

    parsed = urlparse(url)
    video_id: Optional[str] = None
    start_time: float = 0.0

    if parsed.hostname in ("www.youtube.com", "youtube.com", "m.youtube.com"):
        if parsed.path == "/watch":
            query = parse_qs(parsed.query)
            video_id = query.get("v", [None])[0]
            t_param = query.get("t", [None])[0]
            if t_param:
                start_time = _parse_time(t_param)
        elif parsed.path.startswith("/embed/"):
            video_id = parsed.path.split("/")[2]
        elif parsed.path.startswith("/v/"):
            video_id = parsed.path.split("/")[2]
    elif parsed.hostname == "youtu.be":
        video_id = parsed.path.lstrip("/").split("?")[0]
        query = parse_qs(parsed.query)
        t_param = query.get("t", [None])[0]
        if t_param:
            start_time = _parse_time(t_param)

    if not video_id:
        match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11})", url)
        if match:
            video_id = match.group(1)

    canonical_url = f"https://www.youtube.com/watch?v={video_id}" if video_id else url

    return {
        "video_id": video_id,
        "canonical_url": canonical_url,
        "start_time": start_time
    }

def _parse_time(time_str: str) -> float:
    try:
        clean = time_str.lower().rstrip("s")
        if "m" in clean:
            parts = clean.split("m")
            minutes = float(parts[0])
            seconds = float(parts[1]) if parts[1] else 0.0
            return minutes * 60.0 + seconds
        return float(clean)
    except (ValueError, TypeError):
        return 0.0
