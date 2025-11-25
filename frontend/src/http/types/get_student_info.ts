export type ProjectStatus =
  | 'ANALISE'
  | 'BUSCANDO_EQUIPE'
  | 'EM_ANDAMENTO'
  | 'REVISAO_QA'
  | 'CONCLUIDO'
  | 'CANCELADO';

export interface DashboardProject {
  projeto_id: number
  titulo: string
  empresa: string
  estado: ProjectStatus
}

export interface StudentProfile {
  cpf:             string
  nome:            string
  email:           string
  data_nascimento: string
  universidade:    string
  curso:           string
  semestre:        number
  habilidades:     string[]
  papeis_projetos: string[]
  projetos?:       DashboardProject[]
}
