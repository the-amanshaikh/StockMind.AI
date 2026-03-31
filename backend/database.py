import sqlite3
from datetime import datetime
from pydantic import BaseModel
from typing import List

DB_PATH = "prompts.db"

class SavedPrompt(BaseModel):
    id: int
    prompt: str
    timestamp: str

def init_db():
    """Create the SQLite table if it doesn't already exist."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS user_prompts
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
         prompt TEXT NOT NULL,
         timestamp TEXT NOT NULL)
    ''')
    conn.commit()
    conn.close()

def log_prompt(prompt_text: str):
    """Insert a new user prompt into the DB."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    c.execute("INSERT INTO user_prompts (prompt, timestamp) VALUES (?, ?)", (prompt_text, current_time))
    conn.commit()
    conn.close()

def get_all_prompts() -> List[SavedPrompt]:
    """Retrieve all logged prompts in descending order (newest first)."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, prompt, timestamp FROM user_prompts ORDER BY id DESC")
    rows = c.fetchall()
    conn.close()
    return [SavedPrompt(id=r[0], prompt=r[1], timestamp=r[2]) for r in rows]
