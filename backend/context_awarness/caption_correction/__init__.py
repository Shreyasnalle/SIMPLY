import logging
from typing import Any, Dict

from . import jobs
from .context_card import build_context_card
from .correction import accepted_corrections, correction_chain, window_input
from .llm import get_chat_model
from .schemas import CorrectedContext
from .windows import make_windows

MAX_WORKERS = 4

logger = logging.getLogger(__name__)


def _uncorrected(clean: Dict[str, Any]) -> CorrectedContext:
    captions = [{**caption, "raw_caption": caption["caption"]} for caption in clean["captions"]]
    return CorrectedContext(**{**clean, "captions": captions})


def correct_captions(clean: Dict[str, Any], title: str, description: str, model=None) -> CorrectedContext:
    captions = clean["captions"]
    if not captions:
        return _uncorrected(clean)

    model = model or get_chat_model()
    card = build_context_card(clean, title, description, model)

    windows = make_windows(len(captions))
    results = correction_chain(model).batch(
        [window_input(captions, window, card) for window in windows],
        config={"max_concurrency": MAX_WORKERS},
        return_exceptions=True,
    )

    corrections: Dict[int, str] = {}
    for window, result in zip(windows, results):
        if isinstance(result, Exception):
            logger.error("Caption correction failed for window %s-%s: %s", window.lo, window.hi, result)
            continue
        corrections.update(accepted_corrections(captions, window, result))

    corrected = [
        {**caption, "caption": corrections.get(i, caption["caption"]), "raw_caption": caption["caption"]}
        for i, caption in enumerate(captions)
    ]
    return CorrectedContext(**{**clean, "captions": corrected})


def run_correction(video_id: str, clean: Dict[str, Any], title: str, description: str, model=None) -> None:
    if not jobs.start(video_id):
        return
    try:
        jobs.finish(video_id, "corrected", correct_captions(clean, title, description, model))
    except Exception:
        logger.exception("Caption correction failed for video %s", video_id)
        jobs.finish(video_id, "failed", _uncorrected(clean))


__all__ = ["correct_captions", "run_correction", "jobs"]
