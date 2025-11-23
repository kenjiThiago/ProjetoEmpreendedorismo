from typing import Any
import psycopg2
from psycopg2.extras import DictCursor

class DatabaseManager:
    "Classe de Gerenciamento do database"

    def __init__(self) -> None:
        self.conn = psycopg2.connect(
            dbname="devstart",
            user="postgres",
            password="1234",
            host="127.0.0.1",
            port=5432,
        )
        self.cursor = self.conn.cursor(cursor_factory=DictCursor)

    def execute_statement(self, statement: str, params=None) -> None:
        try:
            self.cursor.execute(statement, params)
            self.conn.commit()
        except psycopg2.Error as e:
            self.conn.rollback()
            print(f"Erro ao executar o comando: {e}")
            raise e

    def execute_select_all(self, query: str, params=None) -> list[dict[str, Any]]:
        try:
            self.cursor.execute(query, params)
            return [dict(item) for item in self.cursor.fetchall()]
        except psycopg2.Error as e:
            self.conn.rollback()
            print(f"Erro ao executar a consulta:\n{query}\n{e}")
            raise e

    def execute_select_one(self, query: str, params=None) -> dict | None:
        try:
            self.cursor.execute(query, params)
            row = self.cursor.fetchone()

            if not row:
                return None

            return dict(row)
        except psycopg2.Error as e:
            self.conn.rollback()
            print(f"Erro ao executar a consulta:\n{query}\n{e}")
            raise e
