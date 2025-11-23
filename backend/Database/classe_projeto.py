from Database.conector import DatabaseManager

class Projeto():
    def __init__(self, db_provider=DatabaseManager()) -> None:
        self.db = db_provider
    
    def get_projetos(
        self,
        id: int = None,
        empresa_nome: str = "",
        titulo: str = "",
        descricao: str = "",
        complexidade: str = "",
        modalidade: str = "",
        orcamento_total: float = None,
        orcamento_estudantes: float = None,
        data_inicio: str = "",
        prazo_entrega: str = "",
        estado: str = ""
    ):
        query = """
        SELECT 
            id,
            empresa_nome,
            titulo,
            descricao,
            complexidade,
            modalidade,
            orcamento_total,
            orcamento_estudantes,
            data_inicio,
            prazo_entrega,
            estado
        FROM 
            projeto
        """
        
        filtros = []

        if id is not None:
            filtros.append(f"id = {id}")

        if empresa_nome:
            filtros.append(f"unaccent(LOWER(empresa_nome)) LIKE unaccent('%{empresa_nome.lower()}%')")

        if titulo:
            filtros.append(f"unaccent(LOWER(titulo)) LIKE unaccent('%{titulo.lower()}%')")

        if descricao:
            filtros.append(f"unaccent(LOWER(descricao)) LIKE unaccent('%{descricao.lower()}%')")

        if complexidade:
            filtros.append(f"complexidade = '{complexidade.upper()}'")

        if modalidade:
            filtros.append(f"unaccent(LOWER(modalidade)) LIKE unaccent('%{modalidade.lower()}%')")

        if orcamento_total is not None:
            filtros.append(f"orcamento_total = {orcamento_total}")

        if orcamento_estudantes is not None:
            filtros.append(f"orcamento_estudantes = {orcamento_estudantes}")

        if data_inicio:
            filtros.append(f"data_inicio = '{data_inicio}'")

        if prazo_entrega:
            filtros.append(f"prazo_entrega = '{prazo_entrega}'")

        if estado:
            filtros.append(f"estado = '{estado.upper()}'")

        if filtros:
            query += " WHERE " + " AND ".join(filtros)

        query += " ORDER BY id ASC"

        return self.db.execute_select_all(query)

    
    def get_numero_projetos(self) -> int:
        query = "SELECT COUNT(*) as count FROM projeto"
        result = self.db.execute_select_one(query)
        return result['count']
