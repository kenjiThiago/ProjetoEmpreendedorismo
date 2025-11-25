import type { ProjectStatus } from "./get_student_info"

export interface CompanyProject {
  projeto_id: number
  titulo: string
  descricao: string
  estado: ProjectStatus
  candidatos_count: number
}

export interface CompanyProfile {
  nome: string
  cnpj: string
  email: string
  localizacao: string
  setor: string
  descricao: string
  porte: string
  projetos?: CompanyProject[]
}
