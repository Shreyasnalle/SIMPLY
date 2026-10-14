from typing import Any, Dict

from .description_extraction import extract_description
from .rawtext_extraction import extract_rawtext
from .videourl_extraction import extract_videourl


def extract_context(deserialized_data: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(deserialized_data, dict):
        raise TypeError("deserialized_data must be a dictionary")

    videourl_data = extract_videourl(deserialized_data.get("videourl", ""))
    description_data = extract_description(deserialized_data.get("description", ""))
    rawtext_data = extract_rawtext(deserialized_data.get("rawtext", ""))

    return {
        "videourl": videourl_data,
        "description": description_data,
        "rawtext": rawtext_data,
        "channel_name": deserialized_data.get("channel_name", ""),
        "title": deserialized_data.get("title", ""),
    }
