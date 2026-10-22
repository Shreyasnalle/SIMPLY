import json
from typing import Any, Dict, Iterable, Union

VIDEO_CONTEXT_KEYS = ("videourl", "rawtext", "channel_name", "title", "description")
FRAME_CONTEXT_KEYS = ("videourl", "timestamp", "image_data")


def deserialize_json(raw_input: Union[str, bytes]) -> Any:
    try:
        return json.loads(raw_input)
    except (json.JSONDecodeError, UnicodeDecodeError, TypeError) as e:
        raise ValueError(f"Invalid JSON payload: {e}") from e


def _deserialize(payload: Union[str, bytes, Dict[str, Any]], required: Iterable[str]) -> Dict[str, Any]:
    data = deserialize_json(payload) if isinstance(payload, (str, bytes)) else payload
    if not isinstance(data, dict):
        raise ValueError(f"Expected a JSON object, got {type(data).__name__}")
    missing = [key for key in required if key not in data]
    if missing:
        raise ValueError(f"Missing required keys: {', '.join(missing)}")
    return data


def deserialize_video_context(payload: Union[str, bytes, Dict[str, Any]]) -> Dict[str, Any]:
    return _deserialize(payload, VIDEO_CONTEXT_KEYS)


def deserialize_frame_context(payload: Union[str, bytes, Dict[str, Any]]) -> Dict[str, Any]:
    return _deserialize(payload, FRAME_CONTEXT_KEYS)
