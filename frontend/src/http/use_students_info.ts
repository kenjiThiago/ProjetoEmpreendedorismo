import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { Students } from "./types/get_students_info"

interface StudentsResponse {
  estudantes: Students[]
  total_estudantes: number
}

export interface StudentFilters {
  search?: string
  role?: string
}

async function fetchTalents(): Promise<StudentsResponse> {
  const response = await fetch("http://localhost:8000/estudantes")

  if (!response.ok) {
    throw new Error("Falha ao buscar talentos")
  }

  const data = await response.json()

  if (Array.isArray(data)) {
    return { estudantes: data, total_estudantes: data.length }
  }

  return data
}

export function useTalents() {
  return useQuery({
    queryKey: ["talentos_list"],
    queryFn: fetchTalents,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}
