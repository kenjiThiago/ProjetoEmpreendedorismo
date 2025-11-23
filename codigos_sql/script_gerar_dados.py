import random
import unicodedata
from faker import Faker
from datetime import datetime, timedelta

# Configuração do Faker
fake = Faker('pt_BR')

# --- CONFIGURAÇÕES ---
QTD_ESTUDANTES = 1500
QTD_EMPRESAS = 300
QTD_PROJETOS = 1000  # Aumentei um pouco para testar a variedade

DOMINIOS_UNIVERSIDADES = {
    'USP': 'usp.br', 'UNICAMP': 'unicamp.br', 'UNESP': 'unesp.br',
    'FATEC': 'fatec.sp.gov.br', 'PUC-SP': 'pucsp.br', 'Mackenzie': 'mackenzie.br',
    'FIAP': 'fiap.com.br', 'Insper': 'al.insper.edu.br', 'FGV': 'fgv.edu.br',
    'UNIP': 'aluno.unip.br', 'Senac': 'sp.senac.br', 'Impacta': 'aluno.impacta.edu.br'
}

CURSOS = [
    'Sistemas de Informação', 'Ciência da Computação', 'Engenharia de Software', 
    'Análise e Desenv. de Sistemas', 'Engenharia de Computação', 'Banco de Dados', 
    'Segurança da Informação', 'Design Digital', 'Jogos Digitais'
]

HABILIDADES_LISTA = [
    'Python', 'Java', 'JavaScript', 'TypeScript', 'HTML/CSS', 'React.js', 
    'Node.js', 'SQL (PostgreSQL)', 'SQL (MySQL)', 'Flutter', 'Kotlin', 
    'Swift', 'Figma', 'Docker', 'AWS', 'Git', 'C#', 'PHP', 'Wordpress', 
    'Power BI', 'Excel Avançado', 'Scrum', 'Linux', 'Cybersecurity'
]

SETORES = [
    'Varejo', 'Tecnologia', 'Saúde', 'Educação', 'Finanças', 
    'Logística', 'Construção', 'Alimentação', 'Serviços', 'Marketing'
]

# --- LISTAS EXPANDIDAS PARA PROJETOS ---

PREFIXOS = [
    'Desenvolvimento de', 'Criação de', 'Manutenção de', 'Consultoria em', 
    'Automação de', 'Otimização de', 'Migração de', 'Refatoração de', 
    'Integração de', 'Prototipagem de', 'MVP de', 'Redesign de', 
    'Implementação de', 'Monitoramento de', 'Auditoria de', 'Correção de Bugs em'
]

TIPOS = [
    'Website Institucional', 'App Mobile iOS', 'App Mobile Android', 'E-commerce', 
    'Landing Page', 'Sistema de Gestão (ERP)', 'API RESTful', 'Dashboard de BI', 
    'Chatbot com IA', 'Blog Corporativo', 'Sistema de Agendamento', 'Portal do Aluno',
    'Gateway de Pagamento', 'Pipeline de Dados', 'Web Scraper', 'Design System',
    'Interface de Usuário (UI)', 'Banco de Dados SQL', 'Microsserviços', 'PWA (Web App)',
    'Plugin para Wordpress', 'Script de Automação', 'Identidade Visual', 'Sistema de Login'
]

COMPLEMENTOS = [
    '', '', '', # Chances de não ter complemento
    'para Varejo', 'com Integração AWS', 'para Uso Interno', 'versão 2.0',
    'com React e Node', 'focado em SEO', 'para Startup', 'Legacy', 
    'com Pagamento Online', 'Automatizado', 'Responsivo'
]

# --- FUNÇÕES AUXILIARES ---

def esc(texto):
    return str(texto).replace("'", "''")

def remover_acentos(texto):
    nfkd = unicodedata.normalize('NFKD', texto)
    return "".join([c for c in nfkd if not unicodedata.combining(c)])

def gerar_email_estudante(nome_completo, universidade):
    partes = nome_completo.split()
    primeiro = partes[0]
    ultimo = partes[-1]
    usuario = remover_acentos(f"{primeiro}.{ultimo}").lower()
    dominio = DOMINIOS_UNIVERSIDADES.get(universidade, 'uni.edu.br')
    return f"{usuario}@{dominio}"

# --- GERAÇÃO DO SQL ---

def gerar_sql():
    print("Gerando dados v4 (Mais variedade)... Aguarde.")
    
    arquivo = open("insert_dados_v4.sql", "w", encoding="utf-8")
    
    arquivo.write("-- Script gerado via Python (Faker + Variedade de Titulos)\n")
    arquivo.write("TRUNCATE TABLE Habilidades_projeto, Membros_projeto, Habilidades_estudante, Projeto, Empresa, Habilidade, Estudante RESTART IDENTITY CASCADE;\n\n")

    # 1. HABILIDADES
    arquivo.write("-- 1. HABILIDADES\n")
    for hab in HABILIDADES_LISTA:
        arquivo.write(f"INSERT INTO Habilidade (nome) VALUES ('{hab}');\n")
    arquivo.write("\n")

    # 2. ESTUDANTES
    arquivo.write("-- 2. ESTUDANTES\n")
    lista_cpfs_estudantes = []
    
    for _ in range(QTD_ESTUDANTES):
        cpf = fake.cpf()
        nome_sexo = random.choice(['M', 'F'])
        if nome_sexo == 'M':
            nome_real = f"{fake.first_name_male()} {fake.last_name()}"
        else:
            nome_real = f"{fake.first_name_female()} {fake.last_name()}"
            
        nome = esc(nome_real)
        univ = random.choice(list(DOMINIOS_UNIVERSIDADES.keys()))
        email = gerar_email_estudante(nome_real, univ)
        senha_raw = fake.password(length=12, special_chars=True, digits=True, upper_case=True, lower_case=True)
        senha = esc(senha_raw)
        
        data_nasc = fake.date_of_birth(minimum_age=18, maximum_age=30)
        curso = random.choice(CURSOS)
        semestre = random.randint(1, 8)
        
        lista_cpfs_estudantes.append(cpf)
        
        sql = f"INSERT INTO Estudante (cpf, nome, email, senha, data_nascimento, universidade, curso, semestre) VALUES ('{cpf}', '{nome}', '{email}', '{senha}', '{data_nasc}', '{univ}', '{curso}', {semestre});\n"
        arquivo.write(sql)
    arquivo.write("\n")

    # 3. HABILIDADES DOS ESTUDANTES
    arquivo.write("-- 3. HABILIDADES DOS ESTUDANTES\n")
    for cpf in lista_cpfs_estudantes:
        qtd_skills = random.randint(2, 5)
        skills_escolhidas = random.sample(range(1, len(HABILIDADES_LISTA) + 1), qtd_skills)
        for skill_id in skills_escolhidas:
            nivel = random.choice(['BASICO', 'INTERMEDIARIO', 'AVANCADO'])
            arquivo.write(f"INSERT INTO Habilidades_estudante (estudante_cpf, habilidade_id, nivel_proficiencia) VALUES ('{cpf}', {skill_id}, '{nivel}');\n")
    arquivo.write("\n")

    # 4. EMPRESAS
    arquivo.write("-- 4. EMPRESAS\n")
    lista_nomes_empresas = []
    
    for _ in range(QTD_EMPRESAS):
        nome_base = fake.company()
        nome_empresa = esc(nome_base + " " + fake.company_suffix())
        cnpj = fake.cnpj()
        
        dominio_empresa = remover_acentos(nome_base.split()[0]).lower() + ".com.br"
        email = f"contato@{dominio_empresa}"
        
        senha_raw = fake.password(length=random.randint(10, 15), special_chars=True)
        senha = esc(senha_raw)
        
        local = esc(f"{fake.city()} - {fake.state_abbr()}")
        setor = random.choice(SETORES)
        descricao = esc(fake.catch_phrase())
        porte = random.choice(['pequeno', 'médio', 'grande'])
        
        if nome_empresa not in lista_nomes_empresas:
            lista_nomes_empresas.append(nome_empresa)
            sql = f"INSERT INTO Empresa (nome, cnpj, email, senha, localizacao, setor, descricao, porte) VALUES ('{nome_empresa}', '{cnpj}', '{email}', '{senha}', '{local}', '{setor}', '{descricao}', '{porte}');\n"
            arquivo.write(sql)
    arquivo.write("\n")

    # 5. PROJETOS
    arquivo.write("-- 5. PROJETOS\n")
    projeto_id_counter = 1
    
    for _ in range(QTD_PROJETOS):
        empresa = random.choice(lista_nomes_empresas)
        
        # --- Lógica de Título Mais Rico ---
        prefixo = random.choice(PREFIXOS)
        tipo = random.choice(TIPOS)
        complemento = random.choice(COMPLEMENTOS)
        
        titulo_bruto = f"{prefixo} {tipo} {complemento}".strip()
        titulo = esc(titulo_bruto)
        
        descricao = esc(fake.paragraph(nb_sentences=3))
        complexidade = random.choice(['BAIXA', 'MEDIA', 'ALTA'])
        
        # Tenta adivinhar a modalidade baseado no tipo para ficar coerente
        if 'App' in tipo:
            modalidade = 'Mobile'
        elif 'Dados' in tipo or 'BI' in tipo or 'Scraper' in tipo:
            modalidade = 'Data Science'
        elif 'Design' in tipo or 'Interface' in tipo:
            modalidade = 'Design'
        elif 'API' in tipo or 'Microsserviços' in tipo:
            modalidade = 'Backend'
        else:
            modalidade = 'Web' # Default
        
        orcamento = round(random.uniform(1200, 18000), 2)
        orcamento_estudante = round(orcamento * 0.6, 2)
        
        data_inicio = fake.date_between(start_date='-6M', end_date='+1M')
        prazo = data_inicio + timedelta(days=random.randint(15, 120))
        
        estados = ['ANALISE', 'BUSCANDO_EQUIPE', 'EM_ANDAMENTO', 'REVISAO_QA', 'CONCLUIDO', 'CANCELADO']
        estado = random.choices(estados, weights=[1, 2, 4, 2, 3, 1], k=1)[0]
        
        sql = f"INSERT INTO Projeto (empresa_nome, titulo, descricao, complexidade, modalidade, orcamento_total, orcamento_estudantes, data_inicio, prazo_entrega, estado) VALUES ('{empresa}', '{titulo}', '{descricao}', '{complexidade}', '{modalidade}', {orcamento}, {orcamento_estudante}, '{data_inicio}', '{prazo}', '{estado}');\n"
        arquivo.write(sql)

        # 6. HABILIDADES DO PROJETO
        qtd_skills_req = random.randint(1, 4)
        skills_req = random.sample(range(1, len(HABILIDADES_LISTA) + 1), qtd_skills_req)
        for sk in skills_req:
            arquivo.write(f"INSERT INTO Habilidades_projeto (id_projeto, id_habilidade) VALUES ({projeto_id_counter}, {sk});\n")

        # 7. MEMBROS DO PROJETO
        if estado not in ['ANALISE', 'BUSCANDO_EQUIPE', 'CANCELADO']:
            qtd_membros = random.randint(1, 4)
            membros = random.sample(lista_cpfs_estudantes, qtd_membros)
            papeis = ['Dev Front-end', 'Dev Back-end', 'Dev Fullstack', 'Designer UI/UX', 'QA Tester', 'Tech Lead', 'Data Analyst']
            for membro_cpf in membros:
                papel = random.choice(papeis)
                status_membro = 'ATIVO' if estado != 'CONCLUIDO' else 'CONCLUIDO'
                arquivo.write(f"INSERT INTO Membros_projeto (projeto_id, estudante_cpf, papel_no_projeto, estado) VALUES ({projeto_id_counter}, '{membro_cpf}', '{papel}', '{status_membro}');\n")
        
        projeto_id_counter += 1
        
    arquivo.write("\n")
    arquivo.close()
    print("Sucesso! Arquivo 'insert_dados_v4.sql' gerado com títulos ricos.")

if __name__ == "__main__":
    gerar_sql()