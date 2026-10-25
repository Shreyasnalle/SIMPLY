# Caption Correction (LLM-only) — Design

## Intent
YouTube auto-captions mis-hear technical terms ("Redis" → "red he is"). Embeddings and keyword search over chunks built from those captions will not match a user's query. A correction stage fixes mis-heard words before chunking. Timestamps and caption count never change.

Success: on a video with known mis-hearings, the corrected captions contain the right terms, nothing is paraphrased, `start`/`end` are untouched, and a failure at any point degrades to the raw captions instead of blocking the video.

## Placement
```
POST /api/captions
  clean_context_pipeline (deserialize → extract → validate → transform)  → CleanContext (returned to the extension immediately)
  └─ BackgroundTask: correct_captions(CleanContext) → CorrectedContext   → chunking (next spec) reads it
```
Input is `CleanContext`, so captions are already sorted, deduped, noise-free, with valid times. The HTTP response is unchanged.

## Package `backend/context_awarness/caption_correction/`
| File | Responsibility |
|---|---|
| `schemas.py` | `ContextCard {summary, glossary[]}`, `CorrectedCaption {start, end, caption, raw_caption}`, `CorrectedContext` (CleanContext fields with `CorrectedCaption` captions) |
| `llm.py` | Thin Groq wrapper: `complete_json(system, user) -> dict`. Model from env `GROQ_MODEL`; key from `GROQ_API_KEY`. The only module that touches the network. |
| `context_card.py` | `build_context_card(clean, llm)`: one call with title/description/chapter names/full transcript (uniformly sampled if over a character budget) → topic summary + canonical-term glossary |
| `windows.py` | Split captions into cores of 40 with 5 captions of read-only context on each side |
| `correction.py` | `correct_window(...)`: prompt = card + window, returns only changed captions as `{id, text}`; applies guards |
| `jobs.py` | In-memory per-`video_id` registry: status `pending → corrected \| failed`, result store, idempotent (a video already `corrected`/`pending` is not re-run) |
| `__init__.py` | `correct_captions(clean, llm=None)` and `run_correction(video_id, clean)` |

`main.py` gains a `BackgroundTasks` call after `clean_context_pipeline`; it does not wait for it.

## Behaviour
1. **Context card** — a failure here fails the whole job (status `failed`).
2. **Windows** run in parallel (thread pool, 4 workers). Only corrections for ids in the window's core are accepted, so overlaps need no merging.
3. **Prompt rules** — fix only mis-heard words and technical terms using the glossary; do not paraphrase, add, remove or reorder; keep the caption's language; return nothing for captions that need no change.
4. **Guards (deterministic, per correction)** — id must be in the core; text must be a non-empty string; similarity of old vs new (lowercase, spaces removed, `difflib` ratio) must be ≥ 0.6, else the original is kept. A window whose call or JSON fails keeps all its originals.
5. **Output** — every caption carries `raw_caption` (the pre-correction text) next to `caption`.
6. **Failure fallback** — on `failed`, consumers use the cleaned captions with `raw_caption == caption`.

## Testing
Pytest with a fake LLM injected into `correct_captions`; no network. Cases: windowing and core/context split, guard rejection (bad id, empty, too different), failed window keeps originals, failed card → `failed`, timestamps and count unchanged, idempotent job registry. One optional manual smoke test against Groq.

## Out of scope
Chunking, Supabase persistence (registry is in-memory and lost on restart until chunk storage exists), phonetic pre-pass, chapter-aware windows, OCR-fed glossary, query-side expansion, evaluation set.