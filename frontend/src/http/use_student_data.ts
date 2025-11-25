import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { StudentProfile } from "./types/get_student_info"

async function fetchStudentProfile(cpf: string): Promise<StudentProfile> {
  const response = await fetch(`http://localhost:8000/estudantes?cpf=${cpf}`)

  if (!response.ok) {
    throw new Error("Falha ao carregar perfil do estudante")
  }

  const data = await response.json()

  const student_result = Array.isArray(data) ? data[0] : data

  if (!student_result) {
    throw new Error("Estudante não encontrado")
  }

  const student = student_result.estudantes ? student_result.estudantes[0] : student_result

  return student
}

export function useStudentProfile(cpf: string) {
  return useQuery({
    queryKey: ["student_profile", cpf],
    queryFn: () => fetchStudentProfile(cpf),
    enabled: !!cpf,
    staleTime: 1000 * 60 * 5, // Cache de 5 min
    placeholderData: keepPreviousData,
  })
}
