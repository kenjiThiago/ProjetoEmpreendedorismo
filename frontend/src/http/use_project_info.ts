import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { Project } from "./types/get_project_info"

export interface ProjectFilters {
  search?: string // Mapearemos para 'titulo'
  complexity?: string // Mapearemos para 'complexidade'
  modality?: string // Mapearemos para 'modalidade'
  status?: string // Mapearemos para 'estado'
}

interface ProjectsResponse {
  projetos: Project[]
  total_projetos: number
}

async function fetchProjects(
  filters: ProjectFilters
): Promise<ProjectsResponse> {
  const params = new URLSearchParams()

  if (filters.search) {
    params.append("titulo", filters.search)
  }
  if (filters.complexity && filters.complexity !== "Nível") {
    params.append("complexidade", filters.complexity)
  }
  if (filters.modality && filters.modality !== "Modalidade") {
    params.append("modalidade", filters.modality)
  }
  // Novo filtro de estado
  if (filters.status && filters.status !== "Status" && filters.status !== "Todos") {
    params.append("estado", filters.status)
  }

  const response = await fetch(
    `http://localhost:8000/projetos?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error("Falha ao buscar projetos")
  }

  return response.json()
}

export function useProjects(filters: ProjectFilters) {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: () => fetchProjects(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  })
}
