import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Tipos
export interface PendingProject {
  id: number
  titulo: string
  empresa_nome: string
  descricao: string
  estado: string
}

export interface PendingMember {
  id: number
  estudante_cpf: string
  estudante_nome: string
  projeto_titulo: string
  papel_no_projeto: string
  estado: string
}

// --- FETCH FUNCTIONS ---
async function fetchPendingProjects(): Promise<PendingProject[]> {
  try {
    const response = await fetch("http://localhost:8000/admin/projetos_pendentes")
    if (!response.ok) {
      throw new Error("Erro ao buscar projetos pendentes")
    }
    const data = await response.json()
    
    // Garante que retorna um array
    if (Array.isArray(data)) return data
    // Suporte caso o backend retorne { "projetos": [...] } ou similar
    if (data.projetos && Array.isArray(data.projetos)) return data.projetos
    // Se não for array e não tiver a chave, retorna vazio para não quebrar o map
    return []
  } catch (error) {
    console.error("Erro no fetch projetos:", error)
    return []
  }
}

async function fetchPendingMembers(): Promise<PendingMember[]> {
  try {
    const response = await fetch("http://localhost:8000/admin/membros_pendentes")
    if (!response.ok) {
      throw new Error("Erro ao buscar membros pendentes")
    }
    const data = await response.json()
    
    if (Array.isArray(data)) return data
    if (data.membros && Array.isArray(data.membros)) return data.membros
    return []
  } catch (error) {
    console.error("Erro no fetch membros:", error)
    return []
  }
}

// --- ACTION FUNCTIONS ---
async function reviewProject({
  id,
  action,
}: {
  id: number
  action: "APROVAR" | "REJEITAR"
}) {
  const response = await fetch("http://localhost:8000/admin/aprovar_projeto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projeto_id: id, acao: action }),
  })
  if (!response.ok) throw new Error("Falha ao atualizar projeto")
}

async function reviewMember({
  id,
  action,
}: {
  id: number
  action: "APROVAR" | "REJEITAR"
}) {
  const response = await fetch("http://localhost:8000/admin/aprovar_membro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ membro_id: id, acao: action }),
  })
  if (!response.ok) throw new Error("Falha ao atualizar membro")
}

// --- HOOKS ---
export function useAdminData() {
  const queryClient = useQueryClient()

  const pendingProjects = useQuery({
    queryKey: ["admin_pending_projects"],
    queryFn: fetchPendingProjects,
    staleTime: 1000 * 60, // Cache por 1 minuto para evitar 'piscar'
    refetchOnWindowFocus: true,
  })

  const pendingMembers = useQuery({
    queryKey: ["admin_pending_members"],
    queryFn: fetchPendingMembers,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  })

  const mutateProject = useMutation({
    mutationFn: reviewProject,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin_pending_projects"] }),
  })

  const mutateMember = useMutation({
    mutationFn: reviewMember,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin_pending_members"] }),
  })

  return {
    pendingProjects,
    pendingMembers,
    approveProject: (id: number) =>
      mutateProject.mutate({ id, action: "APROVAR" }),
    rejectProject: (id: number) =>
      mutateProject.mutate({ id, action: "REJEITAR" }),
    approveMember: (id: number) =>
      mutateMember.mutate({ id, action: "APROVAR" }),
    rejectMember: (id: number) =>
      mutateMember.mutate({ id, action: "REJEITAR" }),
  }
}
