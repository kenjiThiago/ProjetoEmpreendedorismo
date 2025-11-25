import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { CompanyProfile } from "./types/get_company_dashboard"

async function fetchCompanyProfile(nome: string): Promise<CompanyProfile> {
  // Busca a empresa pelo nome (ou ID/CNPJ se preferir)
  const response = await fetch(`http://localhost:8000/empresas?nome=${nome}`)

  if (!response.ok) {
    throw new Error("Falha ao carregar perfil da empresa")
  }

  const data = await response.json()

  // O json-server retorna array na busca
  const company = Array.isArray(data.empresas) ? data.empresas[0] : data

  if (!company) {
    throw new Error("Empresa não encontrada")
  }

  // BUSCAR PROJETOS DA EMPRESA
  // Assumindo que existe uma rota para pegar projetos filtrados pelo nome da empresa
  const projectsResponse = await fetch(
    `http://localhost:8000/projetos?empresa_nome=${nome}`
  )
  if (projectsResponse.ok) {
    const projectsData = await projectsResponse.json()
    // Adiciona mock de contagem de candidatos se não vier do back
    company.projetos = projectsData.projetos.map((p: any) => ({
      ...p,
      candidatos_count: Math.floor(Math.random() * 15), // Mock temporário
    }))
  }

  return company
}

export function useCompanyProfile(nome: string) {
  return useQuery({
    queryKey: ["company_profile", nome],
    queryFn: () => fetchCompanyProfile(nome),
    enabled: !!nome,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}
