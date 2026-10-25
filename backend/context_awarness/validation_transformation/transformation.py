from typing import Any, Dict, List

from .schemas import CleanContext
from .text import normalize_text


def _captions(rawtext: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    captions: List[Dict[str, Any]] = []
    for item in sorted(rawtext, key=lambda i: (i["start"], i["end"])):
        text = normalize_text(item["text"])
        start, end = round(item["start"], 3), round(item["end"], 3)
        if captions and captions[-1]["caption"] == text and start <= captions[-1]["end"]:
            captions[-1]["end"] = max(captions[-1]["end"], end)
        else:
            captions.append({"start": start, "end": end, "caption": text})
    return captions


def _chapters(chapters: List[Dict[str, Any]], total_duration: float) -> List[Dict[str, Any]]:
    starts = [chapter["start"] for chapter in chapters]
    ends = starts[1:] + [max(total_duration, starts[-1])] if starts else []
    return [
        {"start": chapter["start"], "end": end, "chapter_name": chapter["chapter_name"]}
        for chapter, end in zip(chapters, ends)
    ]


def transform_context(context: Dict[str, Any]) -> Dict[str, Any]:
    captions = _captions(context["rawtext"])
    total_duration = max((caption["end"] for caption in captions), default=0.0)

    return CleanContext(
        videourl=f"https://www.youtube.com/watch?v={context['videourl']['video_id']}",
        video_id=context["videourl"]["video_id"],
        channel_name=context["channel_name"] or context["channelname"],
        total_duration=round(total_duration, 3),
        chapters=_chapters(context["description"]["chapters"], total_duration),
        captions=captions,
    ).model_dump()
