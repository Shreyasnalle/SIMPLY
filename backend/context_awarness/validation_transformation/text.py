import html
import re

_SPEAKER_MARKER = re.compile(r"^(?:>>+\s*)+")


def normalize_text(text: str) -> str:
    text = html.unescape(re.sub(r"\s+", " ", text)).strip()
    return _SPEAKER_MARKER.sub("", text).strip()
