import re
from difflib import SequenceMatcher
from typing import Any, Dict, List

from langchain_core.prompts import ChatPromptTemplate

from .schemas import ContextCard, WindowCorrections
from .windows import Window

SIMILARITY_THRESHOLD = 0.6

CORRECTION_PROMPT = ChatPromptTemplate.from_messages([
    (
        "system",
        "You correct speech-to-text errors in video captions. Fix only words that were clearly misheard, "
        "especially technical terms, names and products from the glossary (for example 'red he is' -> 'Redis'). "
        "Do not paraphrase, add, remove or reorder words, change grammar, or translate. "
        "Only correct lines inside the CORRECT range; other lines are read-only context. "
        "Return only the lines that changed.",
    ),
    (
        "human",
        "Video: {summary}\nGlossary: {glossary}\nCORRECT ids {lo} to {last}.\n{lines}",
    ),
])


def correction_chain(model):
    return CORRECTION_PROMPT | model.with_structured_output(WindowCorrections)


def window_input(captions: List[Dict[str, Any]], window: Window, card: ContextCard) -> Dict[str, Any]:
    return {
        "summary": card.summary,
        "glossary": ", ".join(card.glossary),
        "lo": window.lo,
        "last": window.hi - 1,
        "lines": "\n".join(f"[{i}] {captions[i]['caption']}" for i in range(window.ctx_lo, window.ctx_hi)),
    }


def _squash(text: str) -> str:
    return re.sub(r"\s+", "", text).lower()


def _accept(original: str, corrected: str) -> bool:
    if not corrected.strip() or corrected == original:
        return False
    return SequenceMatcher(None, _squash(original), _squash(corrected)).ratio() >= SIMILARITY_THRESHOLD


def accepted_corrections(captions: List[Dict[str, Any]], window: Window, result: WindowCorrections) -> Dict[int, str]:
    return {
        item.id: item.text.strip()
        for item in result.corrections
        if window.lo <= item.id < window.hi and _accept(captions[item.id]["caption"], item.text)
    }
