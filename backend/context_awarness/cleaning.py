from typing import Any, Dict, Union

from .deserialization import deserialize_video_context
from .extraction import extract_context
from .validation_transformation import validation_and_transformation


def clean_context_pipeline(payload: Union[str, bytes, Dict[str, Any]]) -> Dict[str, Any]:
    deserialized_payload = deserialize_video_context(payload)
    return validation_and_transformation(extract_context(deserialized_payload))
