import { motion } from "framer-motion"
import { AlertCircle, Briefcase, Eye, Search, Send, Upload } from "lucide-react"
import type {
  DashboardProject,
  ProjectStatus,
} from "@/http/types/get_student_info"

interface DashboardProjectsProps {
  projects: DashboardProject[]
  searchTerm: string
  selectedStatus: string
  // selectedCategory removido pois o backend não retorna mais categoria
  onSearchChange: (v: string) => void
  onStatusChange: (v: string) => void
}

export function DashboardProjects({
  projects,
  searchTerm,
  selectedStatus,
  onSearchChange,
  onStatusChange,
}: DashboardProjectsProps) {
  // Helper de Cor e Texto amigável baseado nos novos Status
  const getStatusDisplay = (estado: ProjectStatus) => {
    switch (estado) {
      case "CONCLUIDO":
        return { color: "bg-green-500", label: "Concluído", progress: "100%" }
      case "EM_ANDAMENTO":
        return { color: "bg-blue-500", label: "Em Andamento", progress: "50%" }
      case "REVISAO_QA":
        return { color: "bg-purple-500", label: "Revisão QA", progress: "80%" }
      case "BUSCANDO_EQUIPE":
        return {
          color: "bg-yellow-500",
          label: "Buscando Equipe",
          progress: "20%",
        }
      case "ANALISE":
        return { color: "bg-orange-500", label: "Em Análise", progress: "10%" }
      case "CANCELADO":
        return { color: "bg-red-500", label: "Cancelado", progress: "100%" }
      default:
        return { color: "bg-gray-500", label: estado, progress: "0%" }
    }
  }

  // Como o backend parou de mandar gradientes, geramos um determinístico pelo ID
  const generateGradient = (id: number) => {
    const gradients = [
      "from-orange-500 to-yellow-500",
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-red-500 to-pink-500",
    ]
    return gradients[id % gradients.length]
  }

  // Filtragem Local Atualizada
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.empresa.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      selectedStatus === "Todos" || project.estado === selectedStatus

    return matchesSearch && matchesStatus
  })

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
    >
      <div className="flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
        <h2 className="font-bold text-2xl text-white">Meus Projetos</h2>
        <span className="text-gray-400 text-sm">
          Mostrando {filteredProjects.length} de {projects.length}
        </span>
      </div>

      {/* --- Filtros --- */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2.5 pr-4 pl-10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar meus projetos..."
              type="text"
              value={searchTerm}
            />
          </div>

          <select
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => onStatusChange(e.target.value)}
            value={selectedStatus}
          >
            <option value="Todos">Todos os Status</option>
            <option value="ANALISE">Em Análise</option>
            <option value="BUSCANDO_EQUIPE">Buscando Equipe</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="REVISAO_QA">Revisão QA</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
      </div>

      {/* --- Lista --- */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const statusInfo = getStatusDisplay(project.estado)
            const gradient = generateGradient(project.projeto_id)

            return (
              <div
                className="group hover:-translate-y-1 flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition-all hover:border-gray-700"
                key={project.projeto_id}
              >
                {/* Topo do Card */}
                <div
                  className={`h-28 bg-linear-to-br ${gradient} relative p-4`}
                >
                  <div className="absolute top-3 right-3 rounded border border-white/10 bg-black/40 px-2 py-0.5 font-bold text-[10px] text-white uppercase tracking-wider backdrop-blur-md">
                    {statusInfo.label}
                  </div>
                  <div className="-bottom-6 absolute left-4 h-12 w-12 rounded-lg bg-gray-900 p-1">
                    <div
                      className={`flex h-full w-full items-center justify-center rounded bg-linear-to-br font-bold text-white ${gradient}`}
                    >
                      {project.empresa.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Corpo */}
                <div className="flex flex-1 flex-col px-5 pt-8 pb-5">
                  <h3
                    className="mt-8 mb-0.5 line-clamp-1 font-bold text-lg text-white"
                    title={project.titulo}
                  >
                    {project.titulo}
                  </h3>
                  <p className="mb-32 font-medium text-gray-500 text-xs uppercase">
                    {project.empresa}
                  </p>

                  {/* Status Bar */}
                  <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-gray-800">
                    <div
                      className={`h-full rounded-full ${statusInfo.color}`}
                      style={{ width: statusInfo.progress }}
                    />
                  </div>

                  {/* Botões de Ação baseados no Estado */}
                  <div className="mt-auto">
                    {project.estado === "CONCLUIDO" ? (
                      <button
                        className="btn-secondary flex w-full items-center justify-center gap-2 py-2 text-sm"
                        type="button"
                      >
                        <Eye className="h-3.5 w-3.5" /> Ver Entrega
                      </button>
                    ) : project.estado === "EM_ANDAMENTO" ||
                      project.estado === "REVISAO_QA" ? (
                      <button
                        className="btn-primary flex w-full items-center justify-center gap-2 py-2 text-sm"
                        type="button"
                      >
                        <Upload className="h-3.5 w-3.5" /> Enviar Tarefa
                      </button>
                    ) : project.estado === "CANCELADO" ? (
                      <button
                        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-red-900/50 bg-red-900/20 py-2 text-red-400 text-sm opacity-70"
                        disabled
                        type="button"
                      >
                        <AlertCircle className="h-3.5 w-3.5" /> Cancelado
                      </button>
                    ) : (
                      <button
                        className="btn-secondary flex w-full items-center justify-center gap-2 py-2 text-sm opacity-70 hover:opacity-100"
                        type="button"
                      >
                        <Send className="h-3.5 w-3.5" /> Ver Detalhes
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-800 border-dashed bg-gray-900/30 py-16 text-center">
          <Briefcase className="mx-auto mb-3 h-12 w-12 text-gray-700" />
          <h3 className="font-medium text-white">Nenhum projeto encontrado</h3>
          <p className="text-gray-500 text-sm">Tente limpar os filtros</p>
        </div>
      )}
    </motion.div>
  )
}
