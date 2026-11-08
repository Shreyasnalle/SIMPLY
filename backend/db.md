# Database Design

Simply uses four separate databases. Only the user DB is permanent. The other three are temporary and every row has an `expires_at`.

Why: YouTube captions are YouTube content. The API policies limit stored data to 30 calendar days and require deletion on user request (within 7 days), and the Terms of Service restrict reproducing or downloading content. Keeping caption-derived data short-lived and per user reduces that risk.

| # | Database | Lifetime | Holds |
|---|---|---|---|
| 1 | User DB | Permanent | Who the user is |
| 2 | Chat history DB | Temporary | Chat messages |
| 3 | Chunks DB | Temporary | The words of each video piece |
| 4 | Embeddings DB | Temporary | The meaning fingerprint of each piece |

---

## 1. User DB (permanent)

**`users`**: one row per person.

| Column | Meaning |
|---|---|
| `id` | User id |
| `email` | Email address |
| `created_at` | When they joined |

## 2. Chat history DB (temporary)

**`chat_messages`**: one row per message.

| Column | Meaning |
|---|---|
| `user_id` | Whose chat it is |
| `video_id` | Which video the chat was about |
| `role` | `user` or `assistant` |
| `content` | The message text |
| `citations` | Video timestamps the answer pointed to |
| `created_at` | When it was sent |
| `expires_at` | When the row is deleted |

## 3. Chunks DB (temporary)

**`chunks`**: one row per piece of the video, holding the words.

| Column | Meaning |
|---|---|
| `chunk_id` | Id shared with the embeddings DB |
| `user_id` | Owner |
| `video_id` | Which video |
| `level` | Chapter-sized piece or small piece |
| `parent_id` | Which chapter a small piece sits under |
| `start_s` | Start time in seconds |
| `end_s` | End time in seconds |
| `final_text` | Cleaned words the LLM reads |
| `expires_at` | When the row is deleted |

## 4. Embeddings DB (temporary)

**`embeddings`**: one row per chunk, holding the meaning fingerprint.

| Column | Meaning |
|---|---|
| `chunk_id` | Same id as in the chunks DB |
| `user_id` | Owner |
| `video_id` | Which video |
| `start_s` | Start time in seconds (copied so a search hit says where it is) |
| `end_s` | End time in seconds |
| `embedding` | 384 numbers (`BAAI/bge-small-en-v1.5`) |
| `expires_at` | When the row is deleted |

---

## How a question flows

1. The backend embeds the question and searches the embeddings DB for the nearest chunks. The result gives `chunk_id` values and timestamps.
2. It reads those chunks' words from the chunks DB using `chunk_id`.
3. It sends the words to the LLM, then saves the exchange in the chat history DB.

## Rules

- **No links between databases.** They are separate, so `user_id` and `chunk_id` are plain shared ids with no foreign keys. The backend creates and deletes both sides together.
- **Cleanup.** A daily job in each temporary DB deletes rows after `expires_at`. Keep the chunks DB shorter-lived than the embeddings DB, since the text is the riskier part. 30 days is only YouTube's upper limit.
- **Deleting a user.** The backend clears that user's rows in all four databases.
- **Keyword search** would live in the chunks DB, since that is where the words are.
