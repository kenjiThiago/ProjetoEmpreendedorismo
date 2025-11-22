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