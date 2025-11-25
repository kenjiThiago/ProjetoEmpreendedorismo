from Database.conector import DatabaseManager

class Empresa():
    def __init__(self, db_provider=DatabaseManager()) -> None:
        self.db = db_provider

    def get_empresas(self, nome: str = "",cnpj: str = "",email: str = "",senha: str = "",
                     localizacao: str = "",setor: str = "", descricao: str = "", porte: str = ""):
        query = """
        SELECT
            e.nome,
            e.cnpj,
            e.email,
            e.senha,
            e.localizacao,
            e.setor,
            e.descricao,
            e.porte
        FROM
            empresa e
        """

        filtros = []

        if nome:
            filtros.append(f"unaccent(LOWER(e.nome)) LIKE unaccent('%{nome.lower()}%')")

        if cnpj:
            filtros.append(f"e.cnpj = '{cnpj}'")  # comparação exata, sem LIKE

        if email:
            filtros.append(f"unaccent(LOWER(e.email)) LIKE unaccent('%{email.lower()}%')")

        if senha:
            filtros.append(f"e.senha = '{senha}'")  # comparação exata

        if localizacao:
            filtros.append(f"unaccent(LOWER(e.localizacao)) LIKE unaccent('%{localizacao.lower()}%')")

        if setor:
            filtros.append(f"unaccent(LOWER(e.setor)) LIKE unaccent('%{setor.lower()}%')")

        if descricao:
            filtros.append(f"unaccent(LOWER(e.descricao)) LIKE unaccent('%{descricao.lower()}%')")

        if porte:
            filtros.append(f"unaccent(LOWER(e.porte)) LIKE unaccent('%{porte.lower()}%')")

        if filtros:
            query += " WHERE " + " AND ".join(filtros)


        return self.db.execute_select_all(query)


    def get_numero_empresas(self) -> int:
        query = "SELECT COUNT(*) as count FROM empresa"
        result = self.db.execute_select_one(query)
        return result['count']

    def buscar_por_email(self, email):
        query = "SELECT * FROM empresa WHERE senha = %s"
        self.db.cursor.execute(query, (email,))
        result = self.db.cursor.fetchone()

        if result:
            columns = [desc[0] for desc in self.db.cursor.description]
            return dict(zip(columns, result))
        return None
