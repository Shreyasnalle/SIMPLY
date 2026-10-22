from typing import Any, Dict, List, Union

from .deserialization import deserialize_video_context
from .extraction import extract_context

NON_SPEECH_CAPTIONS = {"[Music]", "[Applause]"}


def validation_and_transformation(context: Dict[str, Any]) -> Dict[str, Any]:
    captions: List[Dict[str, Any]] = [
        {"start": item["start"], "end": item["end"], "caption": item["text"]}
        for item in context["rawtext"]
        if item["text"] and item["text"] not in NON_SPEECH_CAPTIONS
    ]
    total_duration = max((caption["end"] for caption in captions), default=0.0)

    starts = sorted(chapter["start"] for chapter in context["description"]["chapters"])
    names = {chapter["start"]: chapter["chapter_name"] for chapter in context["description"]["chapters"]}
    ends = starts[1:] + [max(total_duration, starts[-1])] if starts else []
    chapters = [
        {"start": start, "end": end, "chapter_name": names[start]}
        for start, end in zip(starts, ends)
    ]

    return {
        "videourl": context["videourl"]["canonical_url"],
        "video_id": context["videourl"]["video_id"],
        "channel_name": context["channel_name"],
        "total_duration": round(total_duration, 3),
        "chapters": chapters,
        "captions": captions,
    }


def clean_context_pipeline(payload: Union[str, bytes, Dict[str, Any]]) -> Dict[str, Any]:
    deserialized_payload = deserialize_video_context(payload)
    return validation_and_transformation(extract_context(deserialized_payload))
