from Database.conector import DatabaseManager
from datetime import date

class Estudante:
    def __init__(self, db_provider=DatabaseManager()) -> None:
        self.db = db_provider

    def get_estudantes(self, cpf=None, nome=None, email=None,senha=None,data_nascimento=None,universidade=None, curso=None, semestre=None):
        
        query = """
        SELECT
            e.cpf,
            e.nome,
            e.email,
            e.senha,
            e.data_nascimento,
            e.universidade,
            e.curso,
            e.semestre,

            (
                SELECT ARRAY_AGG(h.nome || ' - ' || he.nivel_proficiencia)
                FROM Habilidades_estudante he
                JOIN Habilidade h ON he.habilidade_id = h.id
                WHERE he.estudante_cpf = e.cpf
            ) AS habilidades,

            (
                SELECT ARRAY_AGG(mp.papel_no_projeto)
                FROM Membros_projeto mp
                WHERE mp.estudante_cpf = e.cpf
            ) AS papeis_projetos,

            (
                SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'projeto_id', p.id,
                        'titulo', p.titulo,
                        'empresa', p.empresa_nome,
                        'estado', p.estado
                )
            )
                FROM Membros_projeto mp
                JOIN Projeto p ON p.id = mp.projeto_id
                WHERE mp.estudante_cpf = e.cpf
            ) AS projetos

        FROM Estudante e
        """

        filtros = []
        params = {}

        if cpf:
            cpf_limpo = "".join([c for c in cpf if c.isdigit()])
            filtros.append("REGEXP_REPLACE(e.cpf, '[^0-9]', '', 'g') = %(cpf)s")
            params["cpf"] = cpf_limpo

        if nome:
            filtros.append("LOWER(e.nome) LIKE LOWER(%(nome)s)")
            params["nome"] = f"%{nome}%"

        if email:
            filtros.append("LOWER(e.email) LIKE LOWER(%(email)s)")
            params["email"] = f"%{email}%"

        if universidade:
            filtros.append("LOWER(e.universidade) LIKE LOWER(%(universidade)s)")
            params["universidade"] = f"%{universidade}%"

        if curso:
            filtros.append("LOWER(e.curso) LIKE LOWER(%(curso)s)")
            params["curso"] = f"%{curso}%"

        if semestre:
            filtros.append("e.semestre = %(semestre)s")
            params["semestre"] = semestre

        if filtros:
            query += " WHERE " + " AND ".join(filtros)

        query += " ORDER BY e.nome ASC"

        data = self.db.execute_select_all(query, params)

        for item in data:
            if isinstance(item["data_nascimento"], (date,)):
                item["data_nascimento"] = item["data_nascimento"].isoformat()

            if item["habilidades"] is None:
                item["habilidades"] = []

            if item["papeis_projetos"] is None:
                item["papeis_projetos"] = []

            if item["projetos"] is None:
                item["projetos"] = []

        return data


    def count_total(self):
        query = "SELECT COUNT(*) AS total FROM Estudante;"
        resultado = self.db.execute_select_one(query)
        return resultado["total"] if resultado else 0
    
    def count_cursos(self):
        query = "SELECT COUNT(DISTINCT curso) AS total_cursos FROM Estudante;"
        resultado = self.db.execute_select_one(query)
        return resultado["total_cursos"] if resultado else 0
