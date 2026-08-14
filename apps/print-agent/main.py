import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).with_name("print_agent.db")


def init_local_queue() -> None:
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS local_jobs (
                id TEXT PRIMARY KEY,
                payload TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        connection.commit()


if __name__ == "__main__":
    init_local_queue()
    print("QRPrint print-agent foundation ready")
