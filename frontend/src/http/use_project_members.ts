import { useQuery } from "@tanstack/react-query"

export interface ProjectMember {
  estudante_cpf: string
  nome: string
  email: string
  papel_no_projeto: string // Corrigido para bater com o backend
  estado: "ATIVO" | "REMOVIDO" | "CONCLUIDO" | "EM ANALISE"
  universidade: string
  curso: string
}

async function fetchProjectMembers(
  projectId: number
): Promise<ProjectMember[]> {
  // Busca do backend
  try {
    const response = await fetch(
      `http://localhost:8000/membros_projeto?projeto_id=${projectId}`
    )
    
    if (response.ok) {
      const data = await response.json()
      
      // O backend retorna uma lista de projetos [{ projeto_id: 1, membros: [...] }]
      // Precisamos pegar o primeiro item da lista e então a propriedade membros
      if (Array.isArray(data) && data.length > 0) {
         return data[0].membros || []
      }
      
      return []
    }
  } catch (error) {
    console.error("Erro ao buscar membros:", error)
  }

  return []
}

export function useProjectMembers(projectId: number | null) {
  return useQuery({
    queryKey: ["project_members", projectId],
    queryFn: () => fetchProjectMembers(projectId!),
    enabled: !!projectId, // Só busca se tiver um ID selecionado
    staleTime: 0, // Sempre busca dados frescos ao abrir o modal
  })
}
