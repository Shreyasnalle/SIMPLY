import pytest
from langchain_core.runnables import RunnableLambda

from context_awarness.caption_correction import correct_captions, jobs, run_correction
from context_awarness.caption_correction.schemas import ContextCard, Correction, WindowCorrections
from context_awarness.caption_correction.windows import make_windows


def _clean(n=3):
    return {
        "videourl": "https://www.youtube.com/watch?v=abc12345678",
        "video_id": "abc12345678",
        "channel_name": "Chan",
        "total_duration": float(n),
        "chapters": [{"start": 0.0, "end": float(n), "chapter_name": "Intro"}],
        "captions": [{"start": float(i), "end": float(i + 1), "caption": f"line {i}"} for i in range(n)],
    }


class FakeModel:
    def __init__(self, corrections=None, fail_windows=False, fail_card=False):
        self.corrections = corrections or {}
        self.fail_windows, self.fail_card = fail_windows, fail_card
        self.window_calls = 0

    def with_structured_output(self, schema):
        return RunnableLambda(lambda _prompt: self._respond(schema))

    def _respond(self, schema):
        if schema is ContextCard:
            if self.fail_card:
                raise RuntimeError("card failed")
            return ContextCard(summary="A talk about Redis", glossary=["Redis"])
        self.window_calls += 1
        if self.fail_windows:
            raise RuntimeError("window failed")
        return WindowCorrections(corrections=[Correction(id=i, text=t) for i, t in self.corrections.items()])


def test_windows_cover_every_caption_once_with_context():
    windows = make_windows(95)
    assert [(w.lo, w.hi) for w in windows] == [(0, 40), (40, 80), (80, 95)]
    assert (windows[1].ctx_lo, windows[1].ctx_hi) == (35, 85)
    assert (windows[0].ctx_lo, windows[2].ctx_hi) == (0, 95)


def test_windows_empty():
    assert make_windows(0) == []


def test_applies_valid_correction_and_keeps_raw_and_times():
    clean = _clean()
    clean["captions"][1]["caption"] = "red he is is fast"
    model = FakeModel({1: "Redis is fast"})
    result = correct_captions(clean, "Redis", "", model)
    assert result.captions[1].caption == "Redis is fast"
    assert result.captions[1].raw_caption == "red he is is fast"
    assert [(c.start, c.end) for c in result.captions] == [(0.0, 1.0), (1.0, 2.0), (2.0, 3.0)]
    assert result.captions[0].caption == result.captions[0].raw_caption == "line 0"


@pytest.mark.parametrize("bad", [{99: "x"}, {1: ""}, {1: "   "}, {1: "completely different sentence here"}])
def test_guards_reject_bad_corrections(bad):
    result = correct_captions(_clean(), "t", "", FakeModel(bad))
    assert [c.caption for c in result.captions] == ["line 0", "line 1", "line 2"]


def test_failed_window_keeps_originals():
    result = correct_captions(_clean(), "t", "", FakeModel(fail_windows=True))
    assert [c.caption for c in result.captions] == ["line 0", "line 1", "line 2"]


def test_failed_card_raises():
    with pytest.raises(RuntimeError):
        correct_captions(_clean(), "t", "", FakeModel(fail_card=True))


def test_no_captions_skips_model():
    model = FakeModel(fail_card=True)
    assert correct_captions(_clean(0), "t", "", model).captions == []


def test_run_correction_records_corrected_and_is_idempotent():
    jobs.reset()
    model = FakeModel({1: "line 1."})
    run_correction("v1", _clean(), "t", "", model)
    assert jobs.status("v1") == "corrected"
    assert jobs.result("v1").captions[1].caption == "line 1."
    run_correction("v1", _clean(), "t", "", model)
    assert model.window_calls == 1


def test_run_correction_failure_falls_back_to_raw():
    jobs.reset()
    run_correction("v2", _clean(), "t", "", FakeModel(fail_card=True))
    assert jobs.status("v2") == "failed"
    assert [c.caption for c in jobs.result("v2").captions] == ["line 0", "line 1", "line 2"]
