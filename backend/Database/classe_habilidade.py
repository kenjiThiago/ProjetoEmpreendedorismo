from Database.conector import DatabaseManager

class Habilidade:
    def __init__(self, db_provider=DatabaseManager()):
        self.db = db_provider

    def get_habilidades(self, search: str = ""):
        query = "SELECT id, nome FROM Habilidade"
        filtros = []

        if search:
            filtros.append(f"unaccent(LOWER(nome)) LIKE unaccent('%{search.lower()}%')")

        if filtros:
            query += " WHERE " + " AND ".join(filtros)

        query += " ORDER BY nome ASC"

        return self.db.execute_select_all(query)

    def get_habilidade(self, habilidade_id: int):
        query = f"SELECT id, nome FROM Habilidade WHERE id = {habilidade_id}"
        return self.db.execute_select_one(query)
