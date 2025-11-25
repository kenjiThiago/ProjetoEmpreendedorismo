export type ProjectComplexity = 'BAIXA' | 'MEDIA' | 'ALTA'

export interface CreateProjectDTO {
  empresa_nome: string
  titulo: string
  descricao: string
  complexidade: ProjectComplexity
  modalidade: string
  orcamento_total: number
  orcamento_estudantes: number
  data_inicio: string
  prazo_entrega: string
}
