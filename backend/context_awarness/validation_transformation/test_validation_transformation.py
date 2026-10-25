import pytest

from context_awarness.validation_transformation import validation_and_transformation


def _context(rawtext=None, chapters=None, video_id="abc12345678"):
    return {
        "videourl": {
            "videourl": "x",
            "video_id": video_id,
            "start_time": 0.0,
        },
        "description": {"description": "", "chapters": chapters or []},
        "rawtext": rawtext or [],
        "channel_name": "Chan",
        "channelname": "",
        "title": "T",
    }


def _cap(text, start, end):
    return {"text": text, "start": start, "end": end}


def test_response_shape():
    result = validation_and_transformation(_context([_cap("hello", 1.0, 2.0)]))
    assert result == {
        "videourl": "https://www.youtube.com/watch?v=abc12345678",
        "video_id": "abc12345678",
        "channel_name": "Chan",
        "total_duration": 2.0,
        "chapters": [],
        "captions": [{"start": 1.0, "end": 2.0, "caption": "hello"}],
    }


def test_missing_video_id_raises():
    with pytest.raises(ValueError):
        validation_and_transformation(_context([_cap("hi", 0.0, 1.0)], video_id=None))


def test_no_captions_is_valid():
    result = validation_and_transformation(_context())
    assert result["captions"] == [] and result["total_duration"] == 0.0


def test_drops_non_speech_and_invalid_times():
    rawtext = [
        _cap("[Music]", 0.0, 1.0),
        _cap("bad", 5.0, 2.0),
        _cap("neg", -1.0, 2.0),
        _cap("nan", float("nan"), 2.0),
        _cap("ok", 3.0, 4.0),
    ]
    result = validation_and_transformation(_context(rawtext))
    assert [c["caption"] for c in result["captions"]] == ["ok"]


def test_sorts_dedupes_and_strips_speaker_markers():
    rawtext = [
        _cap(">> second", 5.0, 6.0),
        _cap("first", 1.0, 2.0),
        _cap("first", 2.0, 3.0),
        _cap("first", 9.0, 10.0),
    ]
    result = validation_and_transformation(_context(rawtext))
    assert [c["caption"] for c in result["captions"]] == ["first", "second", "first"]
    assert result["captions"][0] == {"start": 1.0, "end": 3.0, "caption": "first"}


def test_chapters_sorted_deduped_with_ends():
    rawtext = [_cap("a", 0.0, 100.0)]
    chapters = [
        {"chapter_name": "B", "start": 60.0},
        {"chapter_name": "A", "start": 0.0},
        {"chapter_name": "dup", "start": 60.0},
        {"chapter_name": "neg", "start": -5.0},
    ]
    result = validation_and_transformation(_context(rawtext, chapters))
    assert result["chapters"] == [
        {"start": 0.0, "end": 60.0, "chapter_name": "A"},
        {"start": 60.0, "end": 100.0, "chapter_name": "B"},
    ]


def test_last_chapter_end_not_before_start():
    result = validation_and_transformation(
        _context([_cap("a", 0.0, 10.0)], [{"chapter_name": "Late", "start": 50.0}])
    )
    assert result["chapters"] == [{"start": 50.0, "end": 50.0, "chapter_name": "Late"}]


def test_normalizes_text_rounds_times_and_resolves_channel_name():
    context = _context([_cap("it&#39;s   a\n test", 0.12345, 1.98765), _cap("   ", 2.0, 3.0), _cap(">>", 3.0, 4.0)])
    context["channel_name"], context["channelname"] = "", "Fallback"
    result = validation_and_transformation(context)
    assert result["captions"] == [{"start": 0.123, "end": 1.988, "caption": "it's a test"}]
    assert result["channel_name"] == "Fallback"
