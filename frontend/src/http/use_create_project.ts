import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateProjectDTO } from "./types/create_project"

async function createProject(data: CreateProjectDTO): Promise<void> {
  const response = await fetch("http://localhost:8000/projetos/adicionar_projeto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Erro ao criar projeto")
  }

  // Simula delay de rede
  return new Promise((resolve) => setTimeout(resolve, 1500))
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      // Invalida o cache para recarregar a lista de projetos automaticamente
      // Supondo que a key usada na lista seja ["company_profile", nome]
      queryClient.invalidateQueries({ queryKey: ["company_profile"] })
      alert("Projeto solicitado com sucesso!")
    },
    onError: (error) => {
      console.error(error)
      alert("Erro ao solicitar projeto. Tente novamente.")
    },
  })
}
