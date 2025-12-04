import { motion } from "framer-motion"
import {
  Building2,
  Clock,
  Code2,
  DollarSign,
  Monitor,
  Users,
  Zap,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getMatchLabel } from "@/lib/recommendation_engine"

interface ProjectCardProps {
  project: any
  viewMode: "grid" | "list"
  index: number
  matchScore?: number
}

export function ProjectCard({
  project,
  viewMode,
  index,
  matchScore,
}: ProjectCardProps) {
  const navigate = useNavigate()

  const projectId = project.id

  const handleCardClick = () => {
    navigate(`/projetos/${projectId}`)
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val)

  const formatDate = (dateStr: string) => {
    if (!dateStr) {
      return "A definir"
    }
    return new Date(dateStr).toLocaleDateString("pt-BR")
  }

  const formatSkillName = (name: string) => name.split("(")[0].trim()

  // Helper para formatar Complexidade
  const formatComplexity = (level: string) => {
    const map: Record<string, string> = {
      BAIXA: "Baixa",
      MEDIA: "Média",
      ALTA: "Alta",
    }
    return map[level] || level
  }

  const getComplexityColor = (level: string) => {
    switch (level) {
      case "BAIXA":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "MEDIA":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "ALTA":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-400"
    }
  }

  // Helper para Status
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "BUSCANDO_EQUIPE":
        return {
          color: "text-green-400 bg-green-400/10 border-green-400/20",
          label: "Vagas Abertas",
          icon: Users,
        }
      case "EM_ANDAMENTO":
        return {
          color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
          label: "Em Andamento",
          icon: Clock,
        }
      case "ANALISE":
        return {
          color: "text-orange-400 bg-orange-400/10 border-orange-400/20",
          label: "Em Análise",
          icon: Clock,
        }
      case "CONCLUIDO":
        return {
          color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
          label: "Concluído",
          icon: Zap,
        }
      default:
        return {
          color: "text-gray-400 bg-gray-400/10 border-gray-400/20",
          label: status?.replace("_", " "),
          icon: Users,
        }
    }
  }

  const matchInfo = matchScore ? getMatchLabel(matchScore) : null
  const skills = project.habilidades || []
  const statusInfo = getStatusDisplay(project.estado)
  const StatusIcon = statusInfo.icon

  // --- MODO LISTA ---
  if (viewMode === "list") {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all duration-300 hover:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        onClick={handleCardClick}
        transition={{ delay: index * 0.05 }}
      >
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-linear-to-br from-blue-900/40 to-purple-900/40">
            <span className="font-bold text-2xl text-white">
              {project.empresa_nome?.charAt(0) || "E"}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {/* Badge de Status (NOVO) */}
                  <span
                    className={`flex items-center gap-1 rounded-full border px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider ${statusInfo.color}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusInfo.label}
                  </span>

                  {matchInfo && (
                    <span
                      className={`flex items-center gap-1 rounded border border-transparent bg-gray-800 px-2 py-1 font-bold text-xs ${matchInfo.text}`}
                    >
                      <Zap className="h-3 w-3 fill-current" />
                      {matchScore}% Match
                    </span>
                  )}

                  <span
                    className={`rounded border px-2 py-1 font-semibold text-xs ${getComplexityColor(project.complexidade)}`}
                  >
                    {formatComplexity(project.complexidade)}
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

                {skills.length > 0 && (
                  <div className="mb-4 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 font-medium text-[10px] text-gray-500 uppercase tracking-wider">
                      <Code2 className="h-3 w-3" />
                      <span>Stack Necessária</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 5).map((skill: any) => (
                        <span
                          className="whitespace-nowrap rounded-md border border-gray-700/50 bg-gray-800 px-2 py-0.5 font-medium text-[11px] text-gray-300"
                          key={skill.id_habilidade}
                        >
                          {formatSkillName(skill.nome)}
                        </span>
                      ))}
                      {skills.length > 5 && (
                        <span className="rounded-md border border-gray-800 bg-gray-900 px-1.5 py-0.5 font-medium text-[10px] text-gray-500">
                          +{skills.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                  <div className="flex items-center text-green-400">
                    <DollarSign className="mr-1 h-4 w-4" />
                    <span className="font-semibold">
                      {formatCurrency(project.orcamento_estudantes || 0)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    Entrega: {formatDate(project.prazo_entrega)}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  className="w-full rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 lg:w-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCardClick()
                  }}
                  type="button"
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // --- MODO GRID ---
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={`group hover:-translate-y-1 flex h-full cursor-pointer flex-col rounded-xl border bg-gray-900 p-6 transition-all duration-300 hover:border-gray-700 ${matchInfo ? "border-gray-700 ring-1 ring-white/5" : "border-gray-800"}`}
      initial={{ opacity: 0, y: 20 }}
      onClick={handleCardClick}
      transition={{ delay: index * 0.05 }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-700 bg-linear-to-br from-blue-900/40 to-purple-900/40">
          <span className="font-bold text-lg text-white">
            {project.empresa_nome?.charAt(0) || "E"}
          </span>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Badge de Status (NOVO) */}
          <span
            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>

          {matchInfo && (
            <span
              className={`flex items-center gap-1 rounded-full bg-gray-800 px-2 py-0.5 font-bold text-[10px] ${matchInfo.text}`}
            >
              <Zap className="h-3 w-3 fill-current" />
              {matchScore}% Match
            </span>
          )}
          <span
            className={`rounded border px-2 py-1 font-semibold text-xs ${getComplexityColor(project.complexidade)}`}
          >
            {formatComplexity(project.complexidade)}
          </span>
        </div>
      </div>

      <h3 className="mb-1 line-clamp-1 font-bold text-lg text-white transition-colors group-hover:text-blue-400">
        {project.titulo}
      </h3>

      <div className="mb-3 flex items-center text-gray-400 text-xs">
        <Building2 className="mr-1 h-3 w-3" />
        {project.empresa_nome}
      </div>

      <p className="mb-4 line-clamp-2 grow text-gray-400 text-sm">
        {project.descricao}
      </p>

      {skills.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill: any) => (
            <span
              className="max-w-[100px] truncate rounded-md border border-gray-700/50 bg-gray-800 px-2 py-0.5 font-medium text-[10px] text-gray-400"
              key={skill.id_habilidade}
            >
              {formatSkillName(skill.nome)}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="rounded-md border border-gray-800 bg-gray-900 px-1.5 py-0.5 font-medium text-[10px] text-gray-500">
              +{skills.length - 3}
            </span>
          )}
        </div>
      )}

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
            <DollarSign className="mr-2 h-4 w-4" />
            Bolsa
          </span>
          <span className="font-semibold text-green-400">
            {formatCurrency(project.orcamento_estudantes || 0)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
