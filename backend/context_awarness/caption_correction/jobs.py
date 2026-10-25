from threading import Lock
from typing import Dict, Optional

from .schemas import CorrectedContext

_lock = Lock()
_status: Dict[str, str] = {}
_results: Dict[str, CorrectedContext] = {}


def start(video_id: str) -> bool:
    with _lock:
        if video_id in _status:
            return False
        _status[video_id] = "pending"
        return True


def finish(video_id: str, status: str, result: CorrectedContext) -> None:
    with _lock:
        _status[video_id] = status
        _results[video_id] = result


def status(video_id: str) -> Optional[str]:
    return _status.get(video_id)


def result(video_id: str) -> Optional[CorrectedContext]:
    return _results.get(video_id)


def reset() -> None:
    with _lock:
        _status.clear()
        _results.clear()
