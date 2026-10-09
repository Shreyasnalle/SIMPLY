import html
import json
import re
import xml.etree.ElementTree as ET
from typing import Dict, Any, List, Optional

from .extracting import extractingurl


def deserialisation(rawtext: str) -> List[Dict[str, Any]]:
    if not rawtext or not rawtext.strip():
        return []

    rawtext = rawtext.strip()

    # Case 1: JSON3 timedtext format
    if rawtext.startswith("{") or rawtext.startswith("["):
        try:
            data = json.loads(rawtext)
            events = data.get("events", []) if isinstance(data, dict) else []
            segments: List[Dict[str, Any]] = []

            for event in events:
                if "segs" not in event:
                    continue
                text = "".join(seg.get("utf8", "") for seg in event.get("segs", []))
                text = text.replace("\n", " ").strip()
                if not text:
                    continue

                start_ms = event.get("tStartMs", 0)
                duration_ms = event.get("dDurationMs", 0)

                segments.append({
                    "start": round(start_ms / 1000.0, 3),
                    "duration": round(duration_ms / 1000.0, 3),
                    "text": text
                })

            if segments:
                return segments
        except (json.JSONDecodeError, AttributeError):
            pass

    # Case 2: XML timedtext or transcript format
    if "<" in rawtext and ">" in rawtext:
        try:
            clean_xml = re.sub(r"&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[a-fA-F0-9]+);)", "&amp;", rawtext)
            root = ET.fromstring(clean_xml)
            segments: List[Dict[str, Any]] = []

            # Format A: <p t="1000" d="2000">text</p>
            for p in root.findall(".//p"):
                text = "".join(p.itertext()).replace("\n", " ").strip()
                if not text:
                    continue
                start_ms = float(p.attrib.get("t", 0))
                duration_ms = float(p.attrib.get("d", 0))
                segments.append({
                    "start": round(start_ms / 1000.0, 3),
                    "duration": round(duration_ms / 1000.0, 3),
                    "text": text
                })

            # Format B: <text start="1.5" dur="2.0">text</text>
            if not segments:
                for text_el in root.findall(".//text"):
                    text = "".join(text_el.itertext()).replace("\n", " ").strip()
                    if not text:
                        continue
                    start = float(text_el.attrib.get("start", 0))
                    duration = float(text_el.attrib.get("dur", 0))
                    segments.append({
                        "start": round(start, 3),
                        "duration": round(duration, 3),
                        "text": text
                    })

            if segments:
                return segments
        except ET.ParseError:
            pass

    # Case 3: Plain text lines fallback
    lines = [line.strip() for line in rawtext.splitlines() if line.strip()]
    return [{"start": 0.0, "duration": 0.0, "text": line} for line in lines]


def validation_and_transformation(
    url_info: Dict[str, Any],
    payload: Dict[str, Any],
    segments: List[Dict[str, Any]]
) -> Dict[str, Any]:
    video_id = url_info.get("video_id") or "unknown_video"
    video_url = url_info.get("canonical_url") or payload.get("videourl", "")
    start_time = url_info.get("start_time", 0.0)

    title = html.unescape(payload.get("title", "")).strip()
    channel_name = html.unescape(payload.get("channel_name", "")).strip()
    description = html.unescape(payload.get("description", "")).strip()
    storyboard_spec = payload.get("storyboard_spec", "").strip()

    cleaned_segments: List[Dict[str, Any]] = []
    total_duration = 0.0

    for seg in segments:
        raw_content = seg.get("text", "")
        cleaned_text = html.unescape(raw_content)
        cleaned_text = re.sub(r"\s+", " ", cleaned_text).strip()

        if not cleaned_text or cleaned_text == "[Music]" or cleaned_text == "[Applause]":
            continue

        start = max(0.0, float(seg.get("start", 0.0)))
        duration = max(0.0, float(seg.get("duration", 0.0)))
        end_time = start + duration

        if end_time > total_duration:
            total_duration = end_time

        cleaned_segments.append({
            "start": round(start, 3),
            "duration": round(duration, 3),
            "end": round(end_time, 3),
            "text": cleaned_text
        })

    return {
        "status": "success",
        "video_id": video_id,
        "video_url": video_url,
        "channel_name": channel_name,
        "title": title,
        "description": description,
        "storyboard_spec": storyboard_spec,
        "start_time": start_time,
        "total_segments": len(cleaned_segments),
        "total_duration": round(total_duration, 3),
        "segments": cleaned_segments
    }


def clean_context_pipeline(payload: Dict[str, Any]) -> Dict[str, Any]:
    url_info = extractingurl(payload.get("videourl", ""))
    raw_segments = deserialisation(payload.get("rawtext", ""))
    cleaned_context = validation_and_transformation(url_info, payload, raw_segments)
    return cleaned_context
