-- Tabela Aluno
CREATE TABLE Estudante (
    cpf             VARCHAR(14)     PRIMARY KEY,
    nome            VARCHAR(100)    NOT NULL,
    email           VARCHAR(100)    NOT NULL,
    senha           VARCHAR(100)    NOT NULL,
    data_nascimento DATE,
    universidade    VARCHAR(100)    NOT NULL,
    curso           VARCHAR(100)    NOT NULL,
    semestre        INT
);

-- Tabela Habilidade
CREATE TABLE Habilidade (
    id              SERIAL          PRIMARY KEY,
    nome            VARCHAR(100)    UNIQUE NOT NULL
);

-- 5. Habilidades do Estudante (N:N)
CREATE TABLE Habilidades_estudante (
    estudante_cpf       VARCHAR(14)     REFERENCES Estudante(cpf) ON DELETE CASCADE,
    habilidade_id       INT     REFERENCES Habilidade(id) ON DELETE CASCADE,
    nivel_proficiencia  VARCHAR(20) CHECK (nivel_proficiencia IN ('BASICO', 'INTERMEDIARIO', 'AVANCADO')),
    PRIMARY KEY (estudante_cpf, habilidade_id)
);


-- Tabela Empresa (cliente)
CREATE TABLE Empresa (
    nome        VARCHAR(100)    PRIMARY KEY,
    cnpj        VARCHAR(20)     UNIQUE NOT NULL,
    email       VARCHAR(100)    NOT NULL,
    senha       VARCHAR(100)    NOT NULL,
    localizacao VARCHAR(100),
    setor       VARCHAR(50),
    descricao   TEXT,
    porte       VARCHAR(50)    -- pequeno, médio ou grande
);

-- Tabela Projetos
CREATE TABLE Projeto (
    id                      SERIAL          PRIMARY KEY,
    empresa_nome            VARCHAR(100)    REFERENCES Empresa(nome),
    titulo                  VARCHAR(100)    NOT NULL,
    descricao               TEXT,
    complexidade            VARCHAR(50)     CHECK (complexidade IN ('BAIXA', 'MEDIA', 'ALTA')),
    modalidade              VARCHAR(50),
    orcamento_total         DECIMAL(10, 2), -- Quanto a empresa paga
    orcamento_estudantes    DECIMAL(10, 2), -- Quanto será repassado aos alunos
    data_inicio             DATE,
    prazo_entrega           DATE,
    estado VARCHAR(20) DEFAULT 'ANALISE' 
        CHECK (estado IN ('ANALISE', 'BUSCANDO_EQUIPE', 'EM_ANDAMENTO', 'REVISAO_QA', 'CONCLUIDO', 'CANCELADO'))
);

-- 7. Membros do Projeto (A Squad)
CREATE TABLE Membros_projeto (
    id                  SERIAL PRIMARY KEY,
    projeto_id          INT REFERENCES Projeto(id) ON DELETE CASCADE,
    estudante_cpf       VARCHAR(14) REFERENCES Estudante(cpf),
    papel_no_projeto    VARCHAR(50) NOT NULL, -- Ex: 'Dev Front-end', 'Líder Técnico'
    estado              VARCHAR(20) DEFAULT 'ATIVO' CHECK (estado IN ('ATIVO', 'REMOVIDO', 'CONCLUIDO'))
);

--Tabela Habilidade_Vaga
CREATE TABLE Habilidades_projeto (
    id_projeto      SERIAL REFERENCES Projeto(id),
    id_habilidade   SERIAL REFERENCES Habilidade(id),
    PRIMARY KEY (id_projeto, id_habilidade)
);

-- 1. Inserindo Habilidades (Skills Técnicas)
INSERT INTO Habilidade (nome) VALUES 
('Python'), ('Java'), ('JavaScript'), ('TypeScript'), ('HTML/CSS'), 
('React.js'), ('Node.js'), ('SQL (PostgreSQL)'), ('SQL (MySQL)'), ('Flutter'), 
('Figma (Design)'), ('Docker'), ('AWS (Básico)'), ('Git/Github'), ('C#'), 
('PHP'), ('Wordpress'), ('Power BI'), ('Excel Avançado'), ('Scrum');

-- 2. Inserindo Estudantes
INSERT INTO Estudante (cpf, nome, email, senha, data_nascimento, universidade, curso, semestre) VALUES
('111.222.333-01', 'João Silva', 'joao.silva@usp.br', 'hash123', '2002-05-10', 'USP', 'Sistemas de Informação', 4),
('111.222.333-02', 'Maria Oliveira', 'maria.o@unicamp.br', 'hash123', '2001-08-20', 'UNICAMP', 'Ciência da Computação', 6),
('111.222.333-03', 'Pedro Santos', 'pedro.s@fatec.sp.gov.br', 'hash123', '2003-01-15', 'FATEC', 'Análise e Desenv. de Sistemas', 3),
('111.222.333-04', 'Ana Costa', 'ana.costa@mackenzie.br', 'hash123', '2000-11-30', 'Mackenzie', 'Sistemas de Informação', 8),
('111.222.333-05', 'Lucas Pereira', 'lucas.p@usp.br', 'hash123', '2004-03-12', 'USP', 'Engenharia de Computação', 2),
('111.222.333-06', 'Beatriz Lima', 'bia.lima@puc.br', 'hash123', '2002-07-22', 'PUC-SP', 'Design Digital', 5),
('111.222.333-07', 'Carlos Souza', 'carlos.s@fiap.com.br', 'hash123', '1999-12-05', 'FIAP', 'Defesa Cibernética', 2),
('111.222.333-08', 'Fernanda Alves', 'fer.alves@usp.br', 'hash123', '2003-09-18', 'USP', 'Matemática Aplicada', 4),
('111.222.333-09', 'Gabriel Rocha', 'gabriel.r@etec.sp.gov.br', 'hash123', '2005-02-14', 'ETEC', 'Técnico em Desenv. Sistemas', 1),
('111.222.333-10', 'Juliana Dias', 'ju.dias@unicamp.br', 'hash123', '2001-06-30', 'UNICAMP', 'Engenharia de Software', 7),
('111.222.333-11', 'Rafael Martins', 'rafa.m@usp.br', 'hash123', '2002-04-25', 'USP', 'Sistemas de Informação', 5),
('111.222.333-12', 'Larissa Ferreira', 'lari.f@fgv.br', 'hash123', '2000-10-10', 'FGV', 'Administração (foco em TI)', 6),
('111.222.333-13', 'Thiago Gomes', 'thiago.g@insper.edu.br', 'hash123', '2003-05-05', 'Insper', 'Ciência da Computação', 3),
('111.222.333-14', 'Camila Ribeiro', 'camila.r@usp.br', 'hash123', '2002-01-20', 'USP', 'Estatística', 5),
('111.222.333-15', 'Bruno Carvalho', 'bruno.c@fatec.sp.gov.br', 'hash123', '2004-11-11', 'FATEC', 'Banco de Dados', 2),
('111.222.333-16', 'Amanda Nunes', 'amanda.n@puc.br', 'hash123', '2001-03-08', 'PUC-SP', 'Jogos Digitais', 6),
('111.222.333-17', 'Rodrigo Mendes', 'rodrigo.m@usp.br', 'hash123', '2003-08-28', 'USP', 'Física Computacional', 4),
('111.222.333-18', 'Mariana Castro', 'mari.c@mackenzie.br', 'hash123', '2002-12-12', 'Mackenzie', 'Sistemas de Informação', 5),
('111.222.333-19', 'Felipe Araujo', 'felipe.a@unicamp.br', 'hash123', '2000-05-15', 'UNICAMP', 'Engenharia Elétrica', 8),
('111.222.333-20', 'Isabela Ramos', 'isa.r@usp.br', 'hash123', '2004-09-09', 'USP', 'Ciência de Dados', 2);

-- 3. Inserindo Empresas (Clientes)
INSERT INTO Empresa (nome, cnpj, email, senha, localizacao, setor, descricao, porte) VALUES
('TechSolutions Ltda', '12.345.678/0001-01', 'contato@techsolutions.com', 'pass123', 'São Paulo, SP', 'Consultoria', 'Consultoria de RH.', 'pequeno'),
('Padaria do João', '12.345.678/0001-02', 'joao@padaria.com', 'pass123', 'Osasco, SP', 'Varejo', 'Padaria artesanal tradicional.', 'pequeno'),
('Advocacia Silva', '12.345.678/0001-03', 'silva@advocacia.com', 'pass123', 'São Paulo, SP', 'Jurídico', 'Escritório trabalhista.', 'pequeno'),
('Clínica Sorriso', '12.345.678/0001-04', 'contato@sorriso.com', 'pass123', 'Campinas, SP', 'Saúde', 'Clínica odontológica.', 'médio'),
('Mercadinho Bairro', '12.345.678/0001-05', 'admin@mercadinho.com', 'pass123', 'São Paulo, SP', 'Varejo', 'Minimercado local.', 'pequeno'),
('StartUp Fin', '12.345.678/0001-06', 'hello@fin.com', 'pass123', 'São Paulo, SP', 'Fintech', 'App de finanças.', 'médio'),
('Transportadora Rápido', '12.345.678/0001-07', 'logistica@rapido.com', 'pass123', 'Guarulhos, SP', 'Logística', 'Fretes regionais.', 'médio'),
('Escola Aprender', '12.345.678/0001-08', 'diretoria@aprender.com', 'pass123', 'São Bernardo, SP', 'Educação', 'Escola infantil.', 'pequeno'),
('Construtora Fort', '12.345.678/0001-09', 'eng@fort.com', 'pass123', 'São Paulo, SP', 'Construção', 'Reformas residenciais.', 'médio'),
('PetShop Amigo', '12.345.678/0001-10', 'pet@amigo.com', 'pass123', 'Santo André, SP', 'Serviços', 'Banho e tosa.', 'pequeno'),
('Restaurante Sabor', '12.345.678/0001-11', 'chefe@sabor.com', 'pass123', 'São Paulo, SP', 'Alimentação', 'Restaurante self-service.', 'pequeno'),
('Academia Fit', '12.345.678/0001-12', 'treino@fit.com', 'pass123', 'Barueri, SP', 'Saúde', 'Academia de musculação.', 'pequeno'),
('Imobiliária Casa Nova', '12.345.678/0001-13', 'vendas@casanova.com', 'pass123', 'São Paulo, SP', 'Imobiliário', 'Venda e aluguel.', 'médio'),
('Oficina Mecânica Zé', '12.345.678/0001-14', 'ze@mecanica.com', 'pass123', 'São Paulo, SP', 'Automotivo', 'Reparos gerais.', 'pequeno'),
('Eventos Top', '12.345.678/0001-15', 'festa@top.com', 'pass123', 'São Paulo, SP', 'Eventos', 'Organização de festas.', 'pequeno'),
('Editora Livro Bom', '12.345.678/0001-16', 'edit@livrobom.com', 'pass123', 'São Paulo, SP', 'Editorial', 'Publicação independente.', 'pequeno'),
('ONG Ajuda', '12.345.678/0001-17', 'contato@ong.org', 'pass123', 'São Paulo, SP', 'Terceiro Setor', 'Apoio comunitário.', 'pequeno'),
('Beleza Estética', '12.345.678/0001-18', 'agenda@beleza.com', 'pass123', 'Campinas, SP', 'Beleza', 'Clínica estética.', 'pequeno'),
('Agência Viagem', '12.345.678/0001-19', 'turismo@viagem.com', 'pass123', 'São Paulo, SP', 'Turismo', 'Pacotes turísticos.', 'pequeno'),
('Coworking Space', '12.345.678/0001-20', 'reserva@coworking.com', 'pass123', 'São Paulo, SP', 'Serviços', 'Espaço compartilhado.', 'médio');

-- 4. Associando Habilidades aos Estudantes (Habilidades_estudante)
-- Assumindo que os IDs de Habilidade são de 1 a 20 gerados pelo SERIAL
INSERT INTO Habilidades_estudante (estudante_cpf, habilidade_id, nivel_proficiencia) VALUES
('111.222.333-01', 1, 'AVANCADO'), -- João sabe Python
('111.222.333-01', 8, 'INTERMEDIARIO'), -- João sabe SQL
('111.222.333-02', 2, 'AVANCADO'), -- Maria sabe Java
('111.222.333-03', 3, 'INTERMEDIARIO'), -- Pedro sabe JS
('111.222.333-03', 6, 'BASICO'), -- Pedro sabe React
('111.222.333-04', 18, 'AVANCADO'), -- Ana sabe Power BI
('111.222.333-05', 12, 'INTERMEDIARIO'), -- Lucas sabe Docker
('111.222.333-06', 11, 'AVANCADO'), -- Beatriz sabe Figma
('111.222.333-07', 13, 'BASICO'), -- Carlos sabe AWS
('111.222.333-08', 1, 'AVANCADO'), -- Fernanda sabe Python
('111.222.333-09', 5, 'INTERMEDIARIO'), -- Gabriel sabe HTML/CSS
('111.222.333-10', 14, 'AVANCADO'), -- Juliana sabe Git
('111.222.333-11', 8, 'AVANCADO'), -- Rafael sabe SQL
('111.222.333-12', 19, 'AVANCADO'), -- Larissa sabe Excel
('111.222.333-13', 1, 'INTERMEDIARIO'), -- Thiago sabe Python
('111.222.333-14', 1, 'AVANCADO'), -- Camila sabe Python
('111.222.333-15', 9, 'AVANCADO'), -- Bruno sabe MySQL
('111.222.333-16', 15, 'INTERMEDIARIO'), -- Amanda sabe C#
('111.222.333-17', 1, 'AVANCADO'), -- Rodrigo sabe Python
('111.222.333-18', 7, 'BASICO'); -- Mariana sabe Node.js

-- 5. Inserindo Projetos
INSERT INTO Projeto (empresa_nome, titulo, descricao, complexidade, modalidade, orcamento_total, orcamento_estudantes, data_inicio, prazo_entrega, estado) VALUES
('Padaria do João', 'Site Institucional', 'Landing page simples.', 'BAIXA', 'Web', 1500.00, 800.00, '2025-10-01', '2025-10-20', 'CONCLUIDO'),
('Advocacia Silva', 'Sistema de Arquivos', 'Digitalização de docs.', 'MEDIA', 'Desktop', 3000.00, 1500.00, '2025-11-01', '2025-12-01', 'EM_ANDAMENTO'),
('Clínica Sorriso', 'Agendamento Online', 'Sistema web de agenda.', 'MEDIA', 'Web', 4000.00, 2000.00, '2025-11-10', '2025-12-20', 'BUSCANDO_EQUIPE'),
('TechSolutions Ltda', 'API de Integração', 'Backend em Python.', 'ALTA', 'Backend', 5000.00, 2500.00, '2025-11-05', '2026-01-05', 'EM_ANDAMENTO'),
('Mercadinho Bairro', 'Controle de Estoque', 'Planilha automatizada.', 'BAIXA', 'Dados', 800.00, 400.00, '2025-10-15', '2025-10-25', 'CONCLUIDO'),
('StartUp Fin', 'App MVP', 'Protótipo em Flutter.', 'ALTA', 'Mobile', 6000.00, 3000.00, '2025-12-01', '2026-02-01', 'ANALISE'),
('Transportadora Rápido', 'Rastreio Simples', 'Página de status.', 'MEDIA', 'Web', 2500.00, 1200.00, '2025-11-20', '2025-12-20', 'BUSCANDO_EQUIPE'),
('Escola Aprender', 'Site Matrícula', 'Formulário online.', 'BAIXA', 'Web', 1800.00, 900.00, '2025-11-15', '2025-11-30', 'EM_ANDAMENTO'),
('Construtora Fort', 'Portfólio de Obras', 'Site galeria de fotos.', 'BAIXA', 'Web', 2000.00, 1000.00, '2025-10-01', '2025-10-30', 'CONCLUIDO'),
('PetShop Amigo', 'App de Fidelidade', 'App simples Android.', 'MEDIA', 'Mobile', 3500.00, 1750.00, '2025-11-22', '2026-01-10', 'BUSCANDO_EQUIPE'),
('Restaurante Sabor', 'Cardápio Digital', 'QR Code web.', 'BAIXA', 'Web', 1200.00, 600.00, '2025-11-01', '2025-11-15', 'CONCLUIDO'),
('Academia Fit', 'Dashboard de Alunos', 'Visualização de dados.', 'MEDIA', 'Dados', 2800.00, 1400.00, '2025-11-25', '2025-12-25', 'REVISAO_QA'),
('Imobiliária Casa Nova', 'Scraper de Preços', 'Bot para coletar dados.', 'ALTA', 'Automação', 4500.00, 2250.00, '2025-12-05', '2026-01-05', 'ANALISE'),
('Oficina Mecânica Zé', 'Gestão de Ordem de Serviço', 'Sistema local.', 'MEDIA', 'Desktop', 3200.00, 1600.00, '2025-11-10', '2025-12-10', 'EM_ANDAMENTO'),
('Eventos Top', 'Landing Page Evento', 'Site temporário.', 'BAIXA', 'Web', 1000.00, 500.00, '2025-11-18', '2025-11-25', 'CONCLUIDO'),
('Editora Livro Bom', 'E-commerce Simples', 'Loja virtual básica.', 'ALTA', 'Web', 5500.00, 2750.00, '2025-12-10', '2026-02-10', 'ANALISE'),
('ONG Ajuda', 'Site Institucional ONG', 'Site informativo.', 'BAIXA', 'Web', 0.00, 0.00, '2025-11-01', '2025-12-01', 'EM_ANDAMENTO'), -- Pro Bono
('Beleza Estética', 'Agendamento WhatsApp', 'Bot simples.', 'MEDIA', 'Automação', 2200.00, 1100.00, '2025-11-20', '2025-12-10', 'BUSCANDO_EQUIPE'),
('Agência Viagem', 'Catálogo de Pacotes', 'PDF interativo/Web.', 'BAIXA', 'Design', 1500.00, 750.00, '2025-11-05', '2025-11-25', 'REVISAO_QA'),
('Coworking Space', 'Sistema de Reservas', 'App de gestão.', 'ALTA', 'Fullstack', 7000.00, 3500.00, '2025-12-01', '2026-03-01', 'ANALISE');

-- 6. Associando Habilidades aos Projetos (Habilidades_projeto)
-- Assumindo IDs de Projeto 1 a 20 e Habilidades 1 a 20
INSERT INTO Habilidades_projeto (id_projeto, id_habilidade) VALUES
(1, 5), -- Site Padaria precisa de HTML/CSS
(2, 2), -- Sistema Advocacia precisa de Java
(3, 6), -- Agenda Clínica precisa de React
(4, 1), -- API Tech precisa de Python
(5, 19), -- Estoque Mercado precisa de Excel
(6, 10), -- App Startup precisa de Flutter
(7, 3), -- Rastreio precisa de JS
(8, 17), -- Site Escola precisa de Wordpress
(9, 5), -- Portfólio precisa de HTML
(10, 10), -- App Pet precisa de Flutter
(11, 11), -- Cardápio precisa de Figma/Design
(12, 18), -- Dashboard precisa de Power BI
(13, 1), -- Scraper precisa de Python
(14, 15), -- Oficina precisa de C#
(15, 5), -- Landing Page precisa de HTML
(16, 16), -- Ecommerce precisa de PHP
(17, 17), -- Site ONG precisa de Wordpress
(18, 1), -- Bot precisa de Python
(19, 11), -- Catálogo precisa de Figma
(20, 7); -- Sistema Coworking precisa de Node.js

-- 7. Alocando Membros aos Projetos (Membros_projeto)
INSERT INTO Membros_projeto (projeto_id, estudante_cpf, papel_no_projeto, estado) VALUES
(1, '111.222.333-09', 'Dev Front-end', 'CONCLUIDO'), -- Gabriel na Padaria
(1, '111.222.333-06', 'Designer', 'CONCLUIDO'), -- Beatriz na Padaria
(2, '111.222.333-02', 'Dev Java', 'ATIVO'), -- Maria na Advocacia
(4, '111.222.333-01', 'Dev Python', 'ATIVO'), -- João na TechSolutions
(4, '111.222.333-14', 'Data Scientist', 'ATIVO'), -- Camila na TechSolutions
(5, '111.222.333-12', 'Analista Dados', 'CONCLUIDO'), -- Larissa no Mercado
(8, '111.222.333-09', 'Webmaster', 'ATIVO'), -- Gabriel na Escola
(9, '111.222.333-06', 'Designer', 'CONCLUIDO'), -- Beatriz na Construtora
(11, '111.222.333-06', 'Designer', 'CONCLUIDO'), -- Beatriz no Restaurante
(12, '111.222.333-04', 'Analista BI', 'ATIVO'), -- Ana na Academia
(14, '111.222.333-16', 'Dev Backend', 'ATIVO'), -- Amanda na Oficina
(15, '111.222.333-03', 'Dev Front-end', 'CONCLUIDO'), -- Pedro no Evento
(17, '111.222.333-15', 'Dev Fullstack', 'ATIVO'), -- Bruno na ONG
(19, '111.222.333-06', 'Designer', 'ATIVO'), -- Beatriz na Viagem
(2, '111.222.333-10', 'QA', 'ATIVO'), -- Juliana na Advocacia
(4, '111.222.333-13', 'Dev Jr', 'ATIVO'), -- Thiago na TechSolutions
(12, '111.222.333-12', 'Suporte', 'ATIVO'), -- Larissa na Academia
(1, '111.222.333-10', 'QA', 'CONCLUIDO'), -- Juliana na Padaria
(9, '111.222.333-03', 'Dev Front', 'CONCLUIDO'), -- Pedro na Construtora
(17, '111.222.333-11', 'DBA', 'ATIVO'); -- Rafael na ONG