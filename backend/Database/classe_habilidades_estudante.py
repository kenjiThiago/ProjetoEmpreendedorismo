from Database.conector import DatabaseManager

class HabilidadesEstudante:
    def __init__(self, db_provider=DatabaseManager()):
        self.db = db_provider

    def get_habilidades_por_estudante(self, estudante_cpf: str):
        query = f"""
        SELECT 
            he.estudante_cpf,
            he.habilidade_id,
            h.nome AS habilidade_nome,
            he.nivel_proficiencia
        FROM Habilidades_estudante he
        JOIN Habilidade h ON he.habilidade_id = h.id
        WHERE he.estudante_cpf = '{estudante_cpf}'
        ORDER BY h.nome ASC
        """
        return self.db.execute_select_all(query)

    def get_estudantes_por_habilidade(self, habilidade_id: int):
        query = f"""
        SELECT 
            he.estudante_cpf,
            h.nome AS habilidade_nome,
            he.nivel_proficiencia
        FROM Habilidades_estudante he
        JOIN Habilidade h ON he.habilidade_id = h.id
        WHERE he.habilidade_id = {habilidade_id}
        ORDER BY he.estudante_cpf ASC
        """
        return self.db.execute_select_all(query)
