from Database.conector import DatabaseManager
from Database.classe_habilidades_projeto import HabilidadesProjeto


class Projeto:
    def __init__(self, db_provider=DatabaseManager()) -> None:
        self.db = db_provider
        self.habilidades_model = HabilidadesProjeto(db_provider)

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
        estado: str = "",
    ):
        query = """
        SELECT 
            p.id,
            p.empresa_nome,
            p.titulo,
            p.descricao,
            p.complexidade,
            p.modalidade,
            p.orcamento_total,
            p.orcamento_estudantes,
            p.data_inicio,
            p.prazo_entrega,
            p.estado,
            (SELECT COUNT(*) FROM Membros_projeto mp WHERE mp.projeto_id = p.id) as candidatos_count
        FROM 
            projeto p
        """

        filtros = []

        if id is not None:
            filtros.append(f"p.id = {id}")

        if empresa_nome:
            filtros.append(
                f"unaccent(LOWER(p.empresa_nome)) LIKE unaccent('%{empresa_nome.lower()}%')"
            )

        if titulo:
            filtros.append(
                f"unaccent(LOWER(p.titulo)) LIKE unaccent('%{titulo.lower()}%')"
            )

        if descricao:
            filtros.append(
                f"unaccent(LOWER(p.descricao)) LIKE unaccent('%{descricao.lower()}%')"
            )

        if complexidade:
            filtros.append(f"p.complexidade = '{complexidade.upper()}'")

        if modalidade:
            filtros.append(
                f"unaccent(LOWER(p.modalidade)) LIKE unaccent('%{modalidade.lower()}%')"
            )

        if orcamento_total is not None:
            filtros.append(f"p.orcamento_total = {orcamento_total}")

        if orcamento_estudantes is not None:
            filtros.append(f"p.orcamento_estudantes = {orcamento_estudantes}")

        if data_inicio:
            filtros.append(f"p.data_inicio = '{data_inicio}'")

        if prazo_entrega:
            filtros.append(f"p.prazo_entrega = '{prazo_entrega}'")

        if estado:
            filtros.append(f"p.estado = '{estado.upper()}'")

        if filtros:
            query += " WHERE " + " AND ".join(filtros)

        query += " ORDER BY p.id ASC"

        projetos = self.db.execute_select_all(query)

        for projeto in projetos:
            habilidades = self.habilidades_model.get_habilidades_por_projeto(
                projeto["id"]
            )
            projeto["habilidades"] = [
                {"id_habilidade": h["id_habilidade"], "nome": h["habilidade_nome"]}
                for h in habilidades
            ]

        return projetos

    def get_numero_projetos(self) -> int:
        query = "SELECT COUNT(*) as count FROM projeto"
        result = self.db.execute_select_one(query)
        return result["count"]

    def adicionar_projeto(
        self,
        empresa_nome,
        titulo,
        descricao=None,
        complexidade=None,
        modalidade=None,
        orcamento_total=None,
        orcamento_estudantes=None,
        data_inicio=None,
        prazo_entrega=None,
        estado="ANALISE",
    ):
        query = """
        INSERT INTO Projeto (
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
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING
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
            estado;
        """

        parametros = (
            empresa_nome,
            titulo,
            descricao,
            complexidade,
            modalidade,
            orcamento_total,
            orcamento_estudantes,
            data_inicio,
            prazo_entrega,
            estado,
        )

        resultado = self.db.execute_select_one(query, parametros)
        self.db.conn.commit()

        return resultado
