from context_awarness.extraction import extract_context, extract_rawtext, extract_videourl


def test_rawtext_is_parsed_not_cleaned():
    raw = '{"events":[{"tStartMs":1234,"dDurationMs":1000,"segs":[{"utf8":"it&#39;s  \\n"}]},{"tStartMs":0,"segs":[{"utf8":""}]}]}'
    assert extract_rawtext(raw) == [
        {"text": "it&#39;s  \n", "start": 1.234, "end": 2.234},
        {"text": "", "start": 0.0, "end": 0.0},
    ]


def test_rawtext_keeps_raw_times():
    raw = '<transcript><text start="1.00049" dur="2.5">hi</text></transcript>'
    assert extract_rawtext(raw) == [{"text": "hi", "start": 1.00049, "end": 3.50049}]


def test_videourl_has_no_canonical_url():
    assert extract_videourl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1m5s") == {
        "videourl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1m5s",
        "video_id": "dQw4w9WgXcQ",
        "start_time": 65.0,
    }


def test_context_passes_channel_names_through():
    context = extract_context({"videourl": "", "channelname": "Old"})
    assert context["channel_name"] == "" and context["channelname"] == "Old"
