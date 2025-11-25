import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { GetCompanyInfo } from "./types/get_companies_info"

export interface CompanyFilters {
  search?: string
  location?: string
  size?: string
  industry?: string
  page?: number
}

interface CompaniesResponse {
  empresas: GetCompanyInfo[]
  total_empresas: number
}

async function fetchCompanies(
  filters: CompanyFilters
): Promise<CompaniesResponse> {
  const params = new URLSearchParams()

  if (filters.search) {
    params.append("nome", filters.search)
  }
  if (filters.location && filters.location !== "Localização") {
    params.append("localizacao", filters.location)
  }
  if (filters.size && filters.size !== "Porte") {
    params.append("porte", filters.size)
  }
  if (filters.industry && filters.industry !== "Setores") {
    params.append("setor", filters.industry)
  }
  if (filters.page) {
    params.append("page", filters.page.toString())
  }

  const response = await fetch(
    `http://localhost:8000/empresas?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error("Falha ao buscar empresas")
  }

  return response.json()
}

export function useCompanies(filters: CompanyFilters) {
  return useQuery({
    queryKey: ["companies", filters],
    queryFn: () => fetchCompanies(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  })
}
