from fastapi.testclient import TestClient

import main


def test_endpoint_returns_clean_context_and_schedules_correction(monkeypatch):
    calls = []
    monkeypatch.setattr(main, "run_correction", lambda *args: calls.append(args))
    raw = '{"events":[{"tStartMs":0,"dDurationMs":2000,"segs":[{"utf8":"hi"}]}]}'
    response = TestClient(main.app).post("/api/captions", json={
        "videourl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "rawtext": raw,
        "title": "My title",
        "description": "desc",
    })
    assert response.status_code == 200
    assert response.json()["captions"] == [{"start": 0.0, "end": 2.0, "caption": "hi"}]
    video_id, cleaned, title, description = calls[0]
    assert (video_id, title, description) == ("dQw4w9WgXcQ", "My title", "desc")
    assert cleaned["captions"][0]["caption"] == "hi"
