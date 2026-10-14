import json
from typing import Dict, Any, Union


def deserialize_json(raw_input: Union[str, bytes]) -> Any:
    if raw_input is None:
        raise ValueError("Cannot deserialize None payload")

    if isinstance(raw_input, bytes):
        try:
            raw_input = raw_input.decode("utf-8")
        except UnicodeDecodeError as e:
            raise ValueError(f"UTF-8 decoding failed: {str(e)}") from e

    if not isinstance(raw_input, str):
        raise TypeError(
            f"Expected str or bytes for JSON deserialization, got {type(raw_input).__name__}"
        )

    stripped = raw_input.strip()
    if not stripped:
        raise ValueError("Empty JSON string received")

    try:
        return json.loads(stripped)
    except json.JSONDecodeError as e:
        raise ValueError(f"Malformed JSON syntax: {str(e)}") from e


def deserialize_video_context(payload: Union[str, bytes, Dict[str, Any]]) -> Any:
    if isinstance(payload, (str, bytes)):
        return deserialize_json(payload)
    if isinstance(payload, dict):
        return payload
    raise TypeError(
        f"Expected str, bytes, or dict, got {type(payload).__name__}"
    )


def deserialize_frame_context(payload: Union[str, bytes, Dict[str, Any]]) -> Any:
    if isinstance(payload, (str, bytes)):
        return deserialize_json(payload)
    if isinstance(payload, dict):
        return payload
    raise TypeError(
        f"Expected str, bytes, or dict, got {type(payload).__name__}"
    )
