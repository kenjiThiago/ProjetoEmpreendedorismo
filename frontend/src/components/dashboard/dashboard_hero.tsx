import { motion } from "framer-motion"
import { BookOpen, Calendar, GraduationCap, Sparkles } from "lucide-react"
// Assumindo que o widget está neste caminho. Ajuste se necessário.
import type { StudentProfile } from "@/http/types/get_student_info"
import SkillsWidget from "./skill_widget"

interface DashboardHeroProps {
  student: StudentProfile
}

export function DashboardHero({ student }: DashboardHeroProps) {
  // Gera iniciais (ex: Amanda Nunes -> AN)
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ")

    const lastName = parts.at(-1)
    if (lastName === undefined) {
      return "U"
    }

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase()
    }
    return (parts[0][0] + lastName[0]).toUpperCase()
  }

  return (
    <section className="relative overflow-hidden border-gray-800 border-b bg-linear-to-br from-gray-900 via-purple-950/20 to-gray-900 py-12">
      {/* Background Decorativo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 items-start gap-8 lg:grid-cols-5"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {/* --- Coluna da Esquerda (Avatar e Texto) - Ocupa 3/5 --- */}
          <div className="flex flex-col items-center gap-8 md:flex-row lg:col-span-3 lg:items-start">
            {/* Avatar */}
            <div className="group relative shrink-0">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-r from-purple-500 to-orange-500 shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-105">
                <span className="font-bold text-3xl text-white tracking-wider">
                  {getInitials(student.nome)}
                </span>
              </div>
              {/* Status Indicator */}
              <div className="-bottom-1 -right-1 absolute rounded-full bg-gray-900 p-1.5">
                <div className="h-4 w-4 animate-pulse rounded-full border-2 border-gray-900 bg-green-500" />
              </div>
            </div>

            {/* Info Principal */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
                <h1 className="font-bold text-3xl text-white">
                  Olá,{" "}
                  <span className="bg-linear-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                    {student.nome}
                  </span>
                  !
                </h1>
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </div>

              <p className="mb-6 max-w-xl text-gray-400">
                Aqui está o resumo da sua jornada acadêmica e profissional.
                Acompanhe o status das suas candidaturas abaixo.
              </p>

              {/* Chips de Informação Acadêmica */}
              <div className="mb-6 flex flex-wrap justify-center gap-3 md:justify-start">
                <div className="flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-gray-300 text-sm">
                  <GraduationCap className="h-4 w-4 text-purple-400" />
                  <span>{student.universidade}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-gray-300 text-sm">
                  <BookOpen className="h-4 w-4 text-blue-400" />
                  <span>{student.curso}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-gray-300 text-sm">
                  <Calendar className="h-4 w-4 text-orange-400" />
                  <span>{student.semestre}º Semestre</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Coluna da Direita (Widget de Habilidades) */}
          <div className="w-full lg:col-span-2">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
              <Sparkles className="h-4 w-4 text-purple-400" />
              Minhas Habilidades
            </h3>
            <SkillsWidget skills={student.habilidades} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
