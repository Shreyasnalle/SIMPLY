import re
from typing import Any, Dict, List


_CHAPTER_PATTERN = re.compile(
    r"^[\s\-\u2013\u2014*\u2022>(\[]*((?:\d{1,2}:)?\d{1,2}:\d{2})[)\]]?[\s\-\u2013\u2014:|]+(.+?)\s*$"
)


def _timestamp_to_seconds(timestamp: str) -> float:
    parts = [int(part) for part in timestamp.split(":")]
    if len(parts) == 2:
        minutes, seconds = parts
        return float(minutes * 60 + seconds)
    hours, minutes, seconds = parts
    return float(hours * 3600 + minutes * 60 + seconds)


def extract_description(description: str) -> Dict[str, Any]:
    if not isinstance(description, str):
        raise TypeError("description must be a string")

    description_lines: List[str] = []
    chapters: List[Dict[str, Any]] = []

    for line in description.splitlines():
        match = _CHAPTER_PATTERN.match(line)
        if match:
            timestamp, title = match.groups()
            chapters.append({
                "title": title.strip(),
                "start": _timestamp_to_seconds(timestamp),
            })
        else:
            description_lines.append(line)

    return {
        "description": "\n".join(description_lines).strip(),
        "chapters": chapters,
    }
