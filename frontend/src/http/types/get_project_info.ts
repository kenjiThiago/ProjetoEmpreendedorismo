export interface Project {
  id:                   number
  empresa_nome:         string
  titulo:               string
  descricao:            string
  complexidade:         "BAIXA" | "MEDIA" | "ALTA"
  modalidade:           string
  orcamento_total:      number
  orcamento_estudantes: number
  data_inicio:          string
  prazo_entrega:        string
  estado:               string
}
