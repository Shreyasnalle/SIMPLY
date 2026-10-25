from typing import List

from pydantic import BaseModel, Field

from ..validation_transformation.schemas import Caption, Chapter


class ContextCard(BaseModel):
    summary: str = Field(description="Two sentences on what the video teaches")
    glossary: List[str] = Field(
        description="Canonical spelling of each technical term, product, library or proper noun the video discusses"
    )


class Correction(BaseModel):
    id: int = Field(description="Id of the corrected line")
    text: str = Field(description="The corrected line")


class WindowCorrections(BaseModel):
    corrections: List[Correction] = Field(description="Only the lines that changed; empty if none need changing")


class CorrectedCaption(Caption):
    raw_caption: str


class CorrectedContext(BaseModel):
    videourl: str
    video_id: str
    channel_name: str
    total_duration: float
    chapters: List[Chapter]
    captions: List[CorrectedCaption]
