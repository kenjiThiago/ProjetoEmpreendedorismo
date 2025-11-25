import { motion } from "framer-motion"
import { Building2, Calendar, Clock, DollarSign, Monitor } from "lucide-react"
import type { Project } from "@/http/types/get_project_info"

interface ProjectCardProps {
  project: Project
  viewMode: "grid" | "list"
  index: number
}

export function ProjectCard({ project, viewMode, index }: ProjectCardProps) {
  const formatMoney = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("pt-BR")

  const getComplexityColor = (level: string) => {
    switch (level) {
      case "BAIXA":
        return "border-green-500/30 text-green-400 bg-green-500/10"
      case "MEDIA":
        return "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
      case "ALTA":
        return "border-red-500/30 text-red-400 bg-red-500/10"
      default:
        return "border-gray-500/30 text-gray-400"
    }
  }

  if (viewMode === "list") {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all duration-300 hover:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: index * 0.05 }}
      >
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Avatar da Empresa */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-linear-to-br from-blue-900/40 to-purple-900/40">
            <span className="font-bold text-2xl text-white">
              {project.empresa_nome.charAt(0)}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded border px-2 py-1 font-semibold text-xs ${getComplexityColor(project.complexidade)}`}
                  >
                    {project.complexidade}
                  </span>
                  <span className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-1 font-semibold text-blue-400 text-xs">
                    {project.modalidade}
                  </span>
                </div>

                <h3 className="mb-1 font-bold text-white text-xl transition-colors group-hover:text-blue-400">
                  {project.titulo}
                </h3>

                <div className="mb-3 flex items-center text-gray-400 text-sm">
                  <Building2 className="mr-1 h-4 w-4" />
                  {project.empresa_nome}
                </div>

                <p className="mb-4 line-clamp-2 max-w-2xl text-gray-400 text-sm">
                  {project.descricao}
                </p>

                <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                  <div className="flex items-center text-green-400">
                    <DollarSign className="mr-1 h-4 w-4" />
                    <span className="font-semibold">
                      {formatMoney(project.orcamento_estudantes)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    Entrega: {formatDate(project.prazo_entrega)}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <button className="btn-primary px-6 py-2 text-sm" type="button">
                  Ver Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="group hover:-translate-y-1 flex h-full flex-col rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all duration-300 hover:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-700 bg-linear-to-br from-blue-900/40 to-purple-900/40">
          <span className="font-bold text-lg text-white">
            {project.empresa_nome.charAt(0)}
          </span>
        </div>
        <span
          className={`rounded border px-2 py-1 font-semibold text-xs ${getComplexityColor(project.complexidade)}`}
        >
          {project.complexidade}
        </span>
      </div>

      <h3 className="mb-1 line-clamp-1 font-bold text-lg text-white transition-colors group-hover:text-blue-400">
        {project.titulo}
      </h3>

      <div className="mb-3 flex items-center text-gray-400 text-xs">
        <Building2 className="mr-1 h-3 w-3" />
        {project.empresa_nome}
      </div>

      <p className="mb-4 line-clamp-3 grow text-gray-400 text-sm">
        {project.descricao}
      </p>

      <div className="mt-auto space-y-3 border-gray-800 border-t pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center text-gray-400">
            <Monitor className="mr-2 h-4 w-4" />
            Modalidade
          </span>
          <span className="text-white">{project.modalidade}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center text-gray-400">
            <Calendar className="mr-2 h-4 w-4" />
            Prazo
          </span>
          <span className="text-white">
            {formatDate(project.prazo_entrega)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center text-gray-400">
            <DollarSign className="mr-2 h-4 w-4" />
            Bolsa
          </span>
          <span className="font-semibold text-green-400">
            {formatMoney(project.orcamento_estudantes)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
