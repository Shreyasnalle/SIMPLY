import math
from typing import Any, Dict, List

from .text import normalize_text

NON_SPEECH_CAPTIONS = {"[Music]", "[Applause]"}


def _valid_time(value: Any) -> bool:
    return isinstance(value, (int, float)) and math.isfinite(value) and value >= 0


def validate_context(context: Dict[str, Any]) -> Dict[str, Any]:
    videourl = context["videourl"]
    if not videourl.get("video_id"):
        raise ValueError("Could not determine a YouTube video id from videourl")

    rawtext: List[Dict[str, Any]] = [
        item for item in context["rawtext"]
        if normalize_text(item["text"]) not in NON_SPEECH_CAPTIONS | {""}
        and _valid_time(item["start"])
        and _valid_time(item["end"])
        and item["end"] >= item["start"]
    ]

    seen_starts = set()
    chapters: List[Dict[str, Any]] = []
    for chapter in sorted(context["description"]["chapters"], key=lambda c: c["start"]):
        if _valid_time(chapter["start"]) and chapter["start"] not in seen_starts:
            seen_starts.add(chapter["start"])
            chapters.append(chapter)

    return {**context, "rawtext": rawtext, "description": {**context["description"], "chapters": chapters}}
