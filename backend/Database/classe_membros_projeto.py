from Database.conector import DatabaseManager
from decimal import Decimal

class MembrosProjeto:
    def __init__(self, db_provider=DatabaseManager()) -> None:
        self.db = db_provider

    def get_membros(
        self,
        projeto_id: int = None,
        estudante_cpf: str = "",
        estado: str = ""
    ):
        query = """
        SELECT 
            mp.id AS membro_id,
            mp.papel_no_projeto,
            mp.estado AS membro_estado,
            p.id AS projeto_id,
            p.titulo AS projeto_titulo,
            p.empresa_nome AS projeto_empresa,
            p.estado AS projeto_estado,
            e.cpf AS estudante_cpf,
            e.nome AS estudante_nome,
            e.email AS estudante_email,
            e.universidade AS estudante_universidade,
            e.curso AS estudante_curso,
            e.semestre AS estudante_semestre
        FROM 
            Membros_projeto mp
        LEFT JOIN Projeto p ON mp.projeto_id = p.id
        LEFT JOIN Estudante e ON mp.estudante_cpf = e.cpf
        """
        
        filtros = []

        if projeto_id is not None:
            filtros.append(f"mp.projeto_id = {projeto_id}")
        if estudante_cpf:
            filtros.append(f"mp.estudante_cpf = '{estudante_cpf}'")
        if estado:
            filtros.append(f"mp.estado = '{estado.upper()}'")
        
        if filtros:
            query += " WHERE " + " AND ".join(filtros)
        
        query += " ORDER BY p.id ASC"

        return self.db.execute_select_all(query)

    def get_numero_membros(self) -> int:
        query = "SELECT COUNT(*) as count FROM Membros_projeto"
        result = self.db.execute_select_one(query)
        return result['count']
    

    def adicionar_membro(self, projeto_id, estudante_cpf, papel_no_projeto, estado="EM ANALISE"):
        query = """
        INSERT INTO Membros_projeto (projeto_id, estudante_cpf, papel_no_projeto, estado)
        VALUES (%s, %s, %s, %s)
        RETURNING id, projeto_id, estudante_cpf, papel_no_projeto, estado;
        """

        parametros = (projeto_id, estudante_cpf, papel_no_projeto, estado)

        resultado = self.db.execute_select_one(query, parametros)
        return resultado


