import type { StudentProfile } from "@/http/types/get_student_info"

export function calculateMatchScore(
  student: StudentProfile,
  project: any // Usando 'any' para garantir acesso a 'habilidades' se a tipagem Project estiver desatualizada
): number {
  let score = 0
  const maxScore = 100

  // 1. Normaliza as skills do aluno (Remove nível ex: "Node.js - AVANCADO" -> "node.js")
  const studentSkills = student.habilidades.map((s) =>
    s.split("-")[0].trim().toLowerCase()
  )

  // 2. Obtém as skills do projeto (se existirem)
  const projectSkills =
    project.habilidades?.map((h: any) => h.nome.trim().toLowerCase()) || []

  let skillsMatched = 0

  if (projectSkills.length > 0) {
    // CENÁRIO A: Projeto tem lista de habilidades
    // Compara lista com lista (Muito mais preciso)
    studentSkills.forEach((studentSkill) => {
      // Verifica se a skill do aluno está na lista do projeto
      // Usamos 'includes' parcial para pegar casos como "React" vs "React.js"
      const isMatch = projectSkills.some(
        (pSkill: string) =>
          pSkill === studentSkill ||
          pSkill.includes(studentSkill) ||
          studentSkill.includes(pSkill)
      )

      if (isMatch) {
        skillsMatched += 1
      }
    })
  } else {
    // CENÁRIO B: Projeto sem skills cadastradas (Fallback)
    // Procura no título e descrição
    const projectText = `${project.titulo} ${project.descricao}`.toLowerCase()
    studentSkills.forEach((skill) => {
      if (projectText.includes(skill)) {
        skillsMatched += 1
      }
    })
  }

  // Cálculo da Pontuação de Skills (Peso Máximo: 50)
  if (skillsMatched > 0) {
    // Se deu match em skills, já começa com 20 pontos
    // Cada skill extra adiciona 15 pontos, até o teto de 50
    score += Math.min(50, 20 + skillsMatched * 15)
  }

  // 3. Match de Senioridade/Semestre (Peso: 30)
  const semestre = student.semestre
  const complexidade = project.complexidade // BAIXA, MEDIA, ALTA

  if (complexidade === "BAIXA") {
    // Ideal para iniciantes (1-4 semestre)
    if (semestre <= 4) {
      score += 30
    } else {
      score += 15 // Ainda serve, mas talvez seja simples demais
    }
  } else if (complexidade === "MEDIA") {
    // Ideal para intermediários (3-7 semestre)
    if (semestre >= 3 && semestre <= 7) {
      score += 30
    } else {
      score += 15
    }
  } else if (complexidade === "ALTA") {
    if (semestre >= 6) {
      score += 30
    } else {
      score += 5 // Muito difícil para iniciantes
    }
  }

  // 4. Match de Modalidade/Papel (Peso: 20)
  const studentRoles = student.papeis_projetos.map((r) => r.toLowerCase())
  const projectModality = project.modalidade?.toLowerCase() || ""
  const projectTextContext =
    `${project.titulo} ${project.descricao}`.toLowerCase()

  const hasRoleMatch = studentRoles.some(
    (role) =>
      projectModality.includes(role) || projectTextContext.includes(role)
  )

  if (hasRoleMatch) {
    score += 20
  }

  // console.log(`Project: ${project.titulo}, Score: ${score}, SkillsMatched: ${skillsMatched}`)

  return Math.min(score, maxScore)
}

export function getMatchLabel(score: number) {
  if (score >= 80) {
    return {
      label: "Match Perfeito",
      color: "bg-green-500",
      text: "text-green-400",
    }
  }
  if (score >= 50) {
    return { label: "Boa Opção", color: "bg-blue-500", text: "text-blue-400" }
  }
  return null
}
