from typing import Any, Dict

from .transformation import transform_context
from .validation import validate_context


def validation_and_transformation(context: Dict[str, Any]) -> Dict[str, Any]:
    return transform_context(validate_context(context))


__all__ = ["validation_and_transformation", "validate_context", "transform_context"]
