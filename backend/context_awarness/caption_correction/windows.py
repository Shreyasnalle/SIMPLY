from dataclasses import dataclass
from typing import List

CORE_SIZE = 40
CONTEXT_SIZE = 5


@dataclass(frozen=True)
class Window:
    lo: int
    hi: int
    ctx_lo: int
    ctx_hi: int


def make_windows(total: int) -> List[Window]:
    return [
        Window(lo, min(lo + CORE_SIZE, total), max(lo - CONTEXT_SIZE, 0), min(lo + CORE_SIZE + CONTEXT_SIZE, total))
        for lo in range(0, total, CORE_SIZE)
    ]
