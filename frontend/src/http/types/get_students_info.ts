export interface StudentsProject {
  projeto_id: number
  titulo: string
  empresa: string
  estado: string
}

export interface Students {
  cpf: string
  nome: string
  email: string
  data_nascimento: string
  universidade: string
  curso: string
  semestre: number
  habilidades: string[]
  papeis_projetos: string[]
  projetos: StudentsProject[]
}
