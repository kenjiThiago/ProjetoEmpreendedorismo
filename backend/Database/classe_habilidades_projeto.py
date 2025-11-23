from Database.conector import DatabaseManager

class HabilidadesProjeto:
    def __init__(self, db_provider=DatabaseManager()):
        self.db = db_provider

    def get_habilidades_por_projeto(self, projeto_id: int):
        query = f"""
        SELECT 
            hp.id_projeto,
            hp.id_habilidade,
            h.nome AS habilidade_nome
        FROM Habilidades_projeto hp
        JOIN Habilidade h ON hp.id_habilidade = h.id
        WHERE hp.id_projeto = {projeto_id}
        ORDER BY h.nome ASC
        """
        return self.db.execute_select_all(query)

    def get_projetos_por_habilidade(self, habilidade_id: int):
        query = f"""
        SELECT 
            hp.id_projeto,
            h.nome AS habilidade_nome
        FROM Habilidades_projeto hp
        JOIN Habilidade h ON hp.id_habilidade = h.id
        WHERE hp.id_habilidade = {habilidade_id}
        ORDER BY hp.id_projeto ASC
        """
        return self.db.execute_select_all(query)
