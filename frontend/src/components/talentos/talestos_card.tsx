import { BookOpen, Calendar, Code, User } from "lucide-react"
import type { Students } from "@/http/types/get_students_info"

interface StudentCardProps {
  student: Students
  index: number
}

export function StudentCard({ student, index }: StudentCardProps) {
  // Gera iniciais (ex: Agatha Aragão -> AA)
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ")
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase()
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  // Helper para limpar a string de habilidade (ex: "C# - AVANCADO" -> "C#")
  const formatSkill = (rawSkill: string) => rawSkill.split("-")[0].trim()

  // Gerador de gradiente determinístico para o avatar
  const getGradient = (id: number) => {
    const gradients = [
      "from-purple-500 to-indigo-500",
      "from-blue-500 to-cyan-500",
      "from-orange-500 to-red-500",
      "from-green-500 to-emerald-500",
      "from-pink-500 to-rose-500",
    ]
    return gradients[id % gradients.length]
  }

  return (
    <div className="group hover:-translate-y-1 relative flex flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-gray-700 hover:shadow-xl">
      {/* Header com Avatar e Papel */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br ${getGradient(index)} font-bold text-white text-xl shadow-lg`}
          >
            {getInitials(student.nome)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white transition-colors group-hover:text-purple-400">
              {student.nome}
            </h3>
            <span className="inline-block rounded border border-gray-700 bg-gray-800 px-2 py-0.5 font-medium text-gray-400 text-xs">
              {student.papeis_projetos[0] || "Estudante"}
            </span>
          </div>
        </div>
      </div>

      {/* Informações Acadêmicas */}
      <div className="mb-6 space-y-3 border-gray-800 border-b pb-6">
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <BookOpen className="h-4 w-4 text-purple-500" />
          <span className="truncate">{student.curso}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <User className="h-4 w-4 text-blue-500" />
          <span className="truncate">{student.universidade}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <Calendar className="h-4 w-4 text-orange-500" />
          <span>{student.semestre}º Semestre</span>
        </div>
      </div>

      {/* Habilidades (Tags) */}
      <div className="mb-6 flex-1">
        <div className="mb-2 flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider">
          <Code className="h-3 w-3" />
          <span>Principais Skills</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {student.habilidades.slice(0, 4).map((skill, i) => (
            <span
              className="rounded-md border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 font-medium text-purple-300 text-xs"
              key={i}
            >
              {formatSkill(skill)}
            </span>
          ))}
          {student.habilidades.length > 4 && (
            <span className="rounded-md bg-gray-800 px-2 py-1 text-gray-500 text-xs">
              +{student.habilidades.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Projetos & Ação */}
      <div className="mt-auto flex items-center justify-between border-gray-800 border-t pt-4">
        <div className="text-gray-500 text-xs">
          <strong className="text-white">{student.projetos.length}</strong>{" "}
          projetos entregues
        </div>
        <button
          className="rounded-lg bg-white px-4 py-2 font-medium text-gray-900 text-sm transition-colors hover:bg-gray-200"
          type="button"
        >
          Ver Perfil
        </button>
      </div>
    </div>
  )
}
