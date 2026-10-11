# Backend Development Action Plan & AI Coding Guardrails

> [!IMPORTANT]
> **Strict AI Directive:** All AI coding assistants working on the `backend/` must strictly operate within the boundaries and phases defined in this document. Do not implement deferred components or wander into out-of-scope modules without explicit user authorization.

---

## 1. Project Scope & Execution Boundaries

### 1.1 In-Scope Focus (Current Milestone)
* **Domain Waterfalls:** `other_videos` and `mathematical` (VOD / pre-recorded educational video pipelines).
* **Core Ingestion Pipeline:** Extraction, deserialisation, validation, transformation, and agent-enhanced chunking for Tier 1 and Tier 2.

### 1.2 Out-of-Scope / Deferred
* **`backend/live_streaming/`:** **FROZEN.** Do not write live stream streaming pipelines, WebRTC handlers, or live RTMP ingestion code at this time.
* **Downstream Waterfall Orchestration:** **DEFERRED.** Do not implement full LangGraph supervisor routing, CRAG evaluators, or Self-RAG generation loops across waterfalls until the chunking foundation (Phases 1–3) is complete and verified.

### 1.3 Permitted Directory Locations
All backend code must be organized strictly within:
* `backend/context_awarness/` (Shared extraction, deserialisation, validation, transformation, chunking, and agents)
* `backend/other_videos/` (VOD education pipelines)
  * `backend/other_videos/long_video/`
  * `backend/other_videos/short_video/`
* `backend/mathematical/` (Formulas, LaTeX, and mathematical reasoning pipelines)

---

## 2. Common Pipeline (Shared by Tier 1 & Tier 2)

Both Tier 1 (global captions) and Tier 2 (live visual frame) pass through the standardized extraction, deserialisation, validation, and transformation layer:

```
[Raw Ingest Payload]
        │
        ▼
1. Extracting URL & Metadata (`extracting.py`)
   - YouTube video ID extraction, canonical URL normalization, timestamp parsing.
        │
        ▼
2. Deserialisation (`cleaning.py`)
   - Robust parsing of raw timedtext formats (JSON3 format, XML `<p>` or `<text>`, plain text fallback).
        │
        ▼
3. Validation & Transformation (`cleaning.py`)
   - HTML entity unescaping, whitespace normalization.
   - Non-speech noise filtering (`[Music]`, `[Applause]`).
   - Timestamps alignment (`start`, `duration`, `end`), metadata sanitation.
```

---

## 3. Tier 1: Caption Ingestion & Agentic Chunking Flow

### 3.1 Flow
```
Browser (inject -> content -> background)
   │ (Captions + metadata: title, description, author)
   ▼
POST /api/captions or /api/context
   │
   ▼
Common Pipeline (Extract → Deserialise → Validate → Transform)
   │
   ▼
Caption Correction Agent (LLM Assistant)
   - Understands technical context from title + description + surrounding sentences.
   - Corrects speech-to-text phonetics and homophones (e.g., "course" -> "CORS", "sequel" -> "SQL", "rust" -> "Rust").
   │
   ▼
Semantic Chunking Engine
   - Boundaries formed along coherent semantic units, audio sentence/pause markers, and description chapters.
   │
   ▼
Supabase Postgres + Vector DB
   - Stores chunk metadata, audio_text, initial final_text, and generated embeddings.
```

### 3.2 Tier 1 Key Rules & Rationale for Dropping Storyboard Sprites
* **Why Storyboards Were Dropped:** YouTube storyboard sprites were completely removed from the pipeline. Storyboard thumbnails are extremely low-resolution (80×45 to 160×90 per tile) and heavily compressed for scrub-bar previews. Attempting VLM OCR on them results in hallucinated code/math that degrades vector retrieval, while downloading and slicing sprite sheets adds brittle parsing and network latency.
* **Clean Text Baseline:** Tier 1 relies entirely on timestamped captions, title, description, and chapter markers.
* **The Caption Correction Agent** operates as an intelligent assistant to ensure high-fidelity technical terminology before chunk vectorization.
* **Visual Heavy Lifting Delegated to Tier 2:** High-fidelity visual context (code, LaTeX formulas, diagrams) is handled exclusively by Tier 2 using full-resolution HTML5 canvas frames captured during active playback or seeks.

---

## 4. Tier 2: Live Canvas Frame Patching Flow

### 4.1 Flow
```
Browser Extension (Playing Video)
   │
   ▼
Perceptual Hash Comparison (dHash in content.js)
   ├── No change (Difference < threshold) ──► SKIP (No network call)
   └── Significant change (Difference >= threshold)
         │
         ▼
POST /api/frame-update (Canvas frame + timestamp + video_id)
         │
         ▼
Common Pipeline Validation + VLM Extraction
   - High-res OCR extraction (code, LaTeX, diagrams, slides).
         │
         ▼
Agent 1: Decision Agent (Postgres Check)
   - Fetches ONLY the matching timeframe chunk from Postgres (NOT vector DB).
   - Compares: Audio Text + Stored Visual Text vs. New VLM Text.
   ├── Decision = NO (duplicate / no new information) ──► DISCARD (0 DB writes, 0 embeddings)
   └── Decision = YES (meaningful new math, code, or context)
         │
         ▼
Agent 2: Synthesis Agent (Audio + Visual Fusion)
   - Merges the frame visual text and audio caption into a clean, unified `final_text`.
         │
         ▼
Update & Re-embed Chunk
   - Re-embeds `final_text` and updates the Supabase record (`vlm_tier = 2`).
```

### 4.2 Tier 2 Key Rules
* **Two Distinct Agents:**
  1. **Decision Agent:** Binary gatekeeper (`update_required: true | false`).
  2. **Synthesis Agent:** Context merger (produces optimal chunk `final_text` from image OCR + audio captions).
* The Decision Agent reads directly from **PostgreSQL**, avoiding vector database latency and compute.

---

## 5. Phase-by-Phase Execution Roadmap

### Phase 1: Common Pipeline Hardening
- [ ] Ensure `extracting.py` and `cleaning.py` handle all edge cases of YouTube timedtext (JSON3, XML variants).
- [ ] Add strict Pydantic schemas for validated payloads.

### Phase 2: Tier 1 Chunking & Caption Correction Agent
- [ ] Implement the **Caption Correction Agent** (LLM prompt + structured output for domain terminology normalization).
- [ ] Implement semantic chunking logic aligned to audio pauses and coherent concepts.
- [ ] Connect Supabase PostgreSQL chunk schema and pgvector insertion.

### Phase 3: Tier 2 Frame Ingestion & Two-Agent Pipeline
- [ ] Implement the **Decision Agent** (comparing VLM output against Postgres chunk).
- [ ] Implement the **Synthesis Agent** (merging audio captions + visual OCR into `final_text`).
- [ ] Handle chunk patch updates and re-embedding in Supabase.

### Phase 4: Downstream Waterfall Orchestration (LATER)
- [ ] State-based router to classify query and route to `mathematical` or `other_videos`.
- [ ] Implement Hierarchical RAG, CRAG, and Self-RAG graphs.
- [ ] *Do not start Phase 4 until Phases 1–3 are tested and approved.*

---

## 6. Coding Constraints Checklist for AI

1. **Language & Stack:** Python 3.10+, FastAPI, LangChain/LangGraph, Groq API, Supabase (`vecs` or `pgvector`), Hugging Face Inference API (`BAAI/bge-small-en-v1.5`).
2. **No Bloat:** No speculative fallback functions, no unnecessary `print()` statements, no boilerplate commentary.
3. **Strict Scope:** Only work on the current task assigned by the user. Do not implement code outside Phases 1–3 without approval.
