import json
import re
import xml.etree.ElementTree as ET
from typing import Any, Dict, List


def _caption(text: str, start: float, duration: float) -> Dict[str, Any]:
    start = float(start)
    return {"text": text, "start": start, "end": start + float(duration)}


def _extract_json(rawtext: str) -> List[Dict[str, Any]]:
    data = json.loads(rawtext)
    events = data.get("events", []) if isinstance(data, dict) else []
    captions: List[Dict[str, Any]] = []

    for event in events:
        segments = event.get("segs", [])
        text = "".join(segment.get("utf8", "") for segment in segments)
        captions.append(_caption(
            text,
            event.get("tStartMs", 0) / 1000,
            event.get("dDurationMs", 0) / 1000,
        ))

    return captions


def _extract_xml(rawtext: str) -> List[Dict[str, Any]]:
    clean_xml = re.sub(
        r"&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[a-fA-F0-9]+);)",
        "&amp;",
        rawtext,
    )
    root = ET.fromstring(clean_xml)
    captions: List[Dict[str, Any]] = []

    for element in root.findall(".//p") + root.findall(".//text"):
        text = "".join(element.itertext())
        start = float(element.attrib.get("t", element.attrib.get("start", 0)))
        duration = float(element.attrib.get("d", element.attrib.get("dur", 0)))
        if "t" in element.attrib or "d" in element.attrib:
            start /= 1000
            duration /= 1000
        captions.append(_caption(text, start, duration))

    return captions


def extract_rawtext(rawtext: str) -> List[Dict[str, Any]]:
    if not isinstance(rawtext, str):
        raise TypeError("rawtext must be a string")

    rawtext = rawtext.strip()
    if not rawtext:
        return []

    try:
        if rawtext.startswith("{") or rawtext.startswith("["):
            return _extract_json(rawtext)
        if "<" in rawtext and ">" in rawtext:
            return _extract_xml(rawtext)
    except (ValueError, TypeError, json.JSONDecodeError, ET.ParseError):
        return []

    return [_caption(line, 0.0, 0.0) for line in rawtext.splitlines()]
