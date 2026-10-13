import json
from typing import Dict, Any, Union


def deserialize_json(raw_input: Union[str, bytes]) -> Any:
    """
    Deserializes a raw JSON string or bytes into native Python objects.

    Args:
        raw_input: JSON string or bytes transmitted over HTTP.

    Returns:
        The deserialized Python object (dict, list, etc.).

    Raises:
        ValueError: If input is empty, invalid type, or contains malformed JSON.
    """
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


def deserialize_video_context(
    payload: Union[str, bytes, Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Deserializes and validates the incoming JSON payload sent from the Chrome
    extension background worker (background.js) for Tier 1 video context ingestion.

    Expected JSON structure from background.js:
    {
        "videourl": str,
        "channel_name": str (or "channelname"),
        "title": str,
        "description": str,
        "rawtext": str
    }

    Args:
        payload: Raw JSON string, UTF-8 bytes, or pre-parsed dictionary.

    Returns:
        Normalized dictionary with verified keys:
        {
            "videourl": str,
            "channel_name": str,
            "title": str,
            "description": str,
            "rawtext": str
        }

    Raises:
        ValueError: If JSON is invalid, not an object, or missing required fields.
    """
    if isinstance(payload, (str, bytes)):
        parsed = deserialize_json(payload)
    elif isinstance(payload, dict):
        parsed = payload
    else:
        raise TypeError(
            f"Expected str, bytes, or dict, got {type(payload).__name__}"
        )

    if not isinstance(parsed, dict):
        raise ValueError(
            f"Expected JSON object (dict), received {type(parsed).__name__}"
        )

    # Presence check on videourl
    videourl = parsed.get("videourl")
    if not videourl or not isinstance(videourl, str) or not videourl.strip():
        raise ValueError("Field 'videourl' is required and must be a non-empty string")

    # Presence check on rawtext
    rawtext = parsed.get("rawtext")
    if rawtext is None or not isinstance(rawtext, str):
        raise ValueError("Field 'rawtext' is required and must be a string")

    # Optional metadata fields with fallback
    channel_name = parsed.get("channel_name") or parsed.get("channelname") or ""
    title = parsed.get("title") or ""
    description = parsed.get("description") or ""

    return {
        "videourl": videourl.strip(),
        "channel_name": str(channel_name).strip(),
        "title": str(title).strip(),
        "description": str(description).strip(),
        "rawtext": rawtext
    }


def deserialize_frame_context(
    payload: Union[str, bytes, Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Deserializes and validates live frame update JSON from background.js.

    Expected JSON structure from background.js:
    {
        "videourl": str,
        "timestamp": float,
        "image_data": str
    }

    Args:
        payload: Raw JSON string, UTF-8 bytes, or dictionary.

    Returns:
        Normalized dictionary with keys (videourl, timestamp, image_data).
    """
    if isinstance(payload, (str, bytes)):
        parsed = deserialize_json(payload)
    elif isinstance(payload, dict):
        parsed = payload
    else:
        raise TypeError(
            f"Expected str, bytes, or dict, got {type(payload).__name__}"
        )

    if not isinstance(parsed, dict):
        raise ValueError(
            f"Expected JSON object (dict), received {type(parsed).__name__}"
        )

    videourl = parsed.get("videourl", "")
    timestamp = float(parsed.get("timestamp", 0.0))
    image_data = parsed.get("image_data", "")

    return {
        "videourl": str(videourl).strip(),
        "timestamp": timestamp,
        "image_data": str(image_data).strip()
    }
