from Database.conector import DatabaseManager

class Administrador:
    def __init__(self, db_provider=DatabaseManager()):
        self.db = db_provider

    def buscar_por_email(self, email):
        query = "SELECT * FROM Administrador WHERE email = %s"
        self.db.cursor.execute(query, (email,))
        result = self.db.cursor.fetchone()

        if result:
            columns = [desc[0] for desc in self.db.cursor.description]
            return dict(zip(columns, result))
        return None
