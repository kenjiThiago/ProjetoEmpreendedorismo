import { useMutation, useQueryClient } from "@tanstack/react-query"

interface ApplyProjectDTO {
  projeto_id: number
  estudante_cpf: string | undefined
  papel_no_projeto: string
}

async function applyToProject(data: ApplyProjectDTO): Promise<void> {
  const response = await fetch(
    "http://localhost:8000/projetos/adicionar_estudante",
    {
      method: "POST",
      // O backend pede request.get_json(force=True), então o Content-Type é importante
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.mensagem || "Erro ao se inscrever no projeto")
  }
}

export function useApplyProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: applyToProject,
    onSuccess: () => {
      // Invalida queries para atualizar status se necessário
      queryClient.invalidateQueries({ queryKey: ["student_profile"] })
      queryClient.invalidateQueries({ queryKey: ["project_details"] })
    },
  })
}
