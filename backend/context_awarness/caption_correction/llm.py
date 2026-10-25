import os
from pathlib import Path

from dotenv import load_dotenv
from langchain_groq import ChatGroq

DEFAULT_MODEL = "openai/gpt-oss-120b"
ENV_FILE = Path(__file__).resolve().parents[2] / "groq_api.env"


def get_chat_model() -> ChatGroq:
    load_dotenv(ENV_FILE)
    return ChatGroq(model=os.getenv("GROQ_MODEL", DEFAULT_MODEL), temperature=0)
