from typing import List

from pydantic import BaseModel


class Caption(BaseModel):
    start: float
    end: float
    caption: str


class Chapter(BaseModel):
    start: float
    end: float
    chapter_name: str


class CleanContext(BaseModel):
    videourl: str
    video_id: str
    channel_name: str
    total_duration: float
    chapters: List[Chapter]
    captions: List[Caption]
