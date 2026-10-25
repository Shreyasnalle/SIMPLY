from typing import Any, Dict, List

from langchain_core.prompts import ChatPromptTemplate

from .schemas import ContextCard

TRANSCRIPT_CHAR_BUDGET = 60_000

CARD_PROMPT = ChatPromptTemplate.from_messages([
    (
        "system",
        "You prepare context for correcting speech-to-text errors in a video transcript. "
        "From the title, description, chapter names and transcript, summarise what the video teaches "
        "and list the technical terms it discusses. Use the correct spelling of each term, "
        "not how the transcript spells it. Keep the glossary under 100 entries.",
    ),
    (
        "human",
        "Title: {title}\nChannel: {channel_name}\nDescription: {description}\n"
        "Chapters: {chapters}\nTranscript: {transcript}",
    ),
])


def _transcript(captions: List[Dict[str, Any]]) -> str:
    text = " ".join(caption["caption"] for caption in captions)
    if len(text) <= TRANSCRIPT_CHAR_BUDGET:
        return text
    stride = -(-len(text) // TRANSCRIPT_CHAR_BUDGET)
    return " ".join(caption["caption"] for caption in captions[::stride])


def build_context_card(clean: Dict[str, Any], title: str, description: str, model) -> ContextCard:
    chain = CARD_PROMPT | model.with_structured_output(ContextCard)
    return chain.invoke({
        "title": title,
        "channel_name": clean["channel_name"],
        "description": description,
        "chapters": ", ".join(chapter["chapter_name"] for chapter in clean["chapters"]),
        "transcript": _transcript(clean["captions"]),
    })
