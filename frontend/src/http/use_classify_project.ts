import { useMutation } from "@tanstack/react-query"

interface ClassifyDTO {
  titulo: string
  descricao: string
}

interface ClassificationResponse {
  complexidade: "BAIXA" | "MEDIA" | "ALTA"
  justificativa: string
  modalidade_sugerida: string
}

async function classifyProject(data: ClassifyDTO): Promise<ClassificationResponse> {
  const response = await fetch("http://localhost:8000/projetos/classificar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Erro ao conectar com a IA")
  }

  return response.json()
}

export function useClassifyProject() {
  return useMutation({
    mutationFn: classifyProject,
  })
}
