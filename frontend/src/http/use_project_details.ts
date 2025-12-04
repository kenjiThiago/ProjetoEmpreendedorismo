import { useQuery } from "@tanstack/react-query"
import type { CompanyProject } from "@/http/types/get_company_dashboard"

// Reutilizando tipos existentes, mas adaptando se necessário
export interface ProjectDetails extends CompanyProject {
  id: number
  empresa_nome: string
  orcamento_total: number
  orcamento_estudantes: number
  data_inicio: string
  prazo_entrega: string
  modalidade: string
  complexidade: string
  habilidades: { id_habilidade: number; nome: string }[]
}

async function fetchProjectDetails(id: string): Promise<ProjectDetails> {
  const response = await fetch(`http://localhost:8000/projetos?id=${id}`)

  if (!response.ok) {
    throw new Error("Falha ao carregar projeto")
  }

  const data = await response.json()
  const project = data.projetos ? data.projetos[0] : data

  return project
}

export function useProjectDetails(id: string) {
  return useQuery({
    queryKey: ["project_details", id],
    queryFn: () => fetchProjectDetails(id),
    enabled: !!id,
  })
}
