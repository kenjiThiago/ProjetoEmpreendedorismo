import { motion } from "framer-motion"
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  Clock,
  Eye,
  Search,
  Send,
  Upload,
  UserCheck,
  UserX,
} from "lucide-react"
import type {
  DashboardProject,
  ProjectStatus,
} from "@/http/types/get_student_info"

interface DashboardProjectsProps {
  projects: DashboardProject[]
  searchTerm: string
  selectedStatus: string
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
  // Helper para Status do PROJETO (Situação Global)
  const getProjectStatusDisplay = (estado: ProjectStatus) => {
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

  // NOVO HELPER: Status do ALUNO (Cores refinadas e ícones contextuais)
  const getMemberStatusDisplay = (status: string) => {
    switch (status) {
      case "ATIVO":
        return {
          // Verde suave para sucesso/ativo
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          icon: UserCheck,
          label: "Aprovado no Squad",
        }
      case "EM ANALISE":
        return {
          // Amarelo/Laranja para espera
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          icon: Clock,
          label: "Candidatura em Análise",
        }
      case "REMOVIDO":
        return {
          // Vermelho para erro/saída
          color: "text-red-400 bg-red-500/10 border-red-500/20",
          icon: UserX,
          label: "Não Selecionado",
        }
      case "CONCLUIDO":
        return {
          // Azul/Indigo para finalização
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          icon: CheckCircle,
          label: "Participação Concluída",
        }
      default:
        return {
          color: "text-gray-400 bg-gray-500/10 border-gray-500/20",
          icon: Briefcase,
          label: status,
        }
    }
  }

  // Gera um gradiente visualmente idêntico ao da página de projetos
  const generateGradient = (id: number) => {
    const gradients = [
      "from-blue-900/40 to-purple-900/40",
      "from-emerald-900/40 to-teal-900/40",
      "from-orange-900/40 to-red-900/40",
      "from-indigo-900/40 to-blue-900/40",
      "from-pink-900/40 to-rose-900/40",
    ]
    return gradients[id % gradients.length]
  }

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

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project: any) => {
            const projectStatusInfo = getProjectStatusDisplay(project.estado)
            const memberStatusInfo = getMemberStatusDisplay(
              project.status_inscricao || "EM ANALISE"
            )
            const MemberIcon = memberStatusInfo.icon
            const gradient = generateGradient(project.projeto_id)

            return (
              <div
                className="group hover:-translate-y-1 flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition-all hover:border-gray-700 hover:shadow-xl"
                key={project.projeto_id}
              >
                {/* --- HEADER DO CARD (GRADIENTE + BADGES) --- */}
                <div
                  className={`h-32 bg-linear-to-br ${gradient} relative p-4`}
                >
                  {/* Badge de Status da Inscrição (Esquerda) */}
                  <div
                    className={`absolute top-3 left-3 flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider shadow-sm backdrop-blur-md ${memberStatusInfo.color} bg-gray-900/80`}
                  >
                    <MemberIcon className="h-3 w-3" />
                    {memberStatusInfo.label}
                  </div>

                  {/* Badge de Status do Projeto (Direita) */}
                  <div className="absolute top-3 right-3 rounded border border-white/10 bg-black/40 px-2 py-0.5 font-bold text-[10px] text-white uppercase tracking-wider backdrop-blur-md">
                    {projectStatusInfo.label}
                  </div>

                  {/* Logo da Empresa (Avatar Sobreposto) */}
                  <div className="-bottom-6 absolute left-5 h-12 w-12 rounded-lg border border-gray-700 bg-gray-900 p-1 shadow-md">
                    <div className="flex h-full w-full items-center justify-center rounded bg-gray-800 font-bold text-lg text-white">
                      {project.empresa.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* --- CORPO DO CARD --- */}
                <div className="flex flex-1 flex-col px-5 pt-10 pb-5">
                  <h3
                    className="mb-1 line-clamp-1 font-bold text-lg text-white transition-colors group-hover:text-purple-400"
                    title={project.titulo}
                  >
                    {project.titulo}
                  </h3>

                  <div className="mb-4 flex items-center font-medium text-gray-500 text-xs uppercase tracking-wide">
                    <Briefcase className="mr-1.5 h-3 w-3" />
                    {project.empresa}
                  </div>

                  {/* Barra de Progresso */}
                  <div className="mb-6 space-y-1.5">
                    <div className="flex justify-between font-medium text-[10px] text-gray-400">
                      <span>Progresso do Projeto</span>
                      <span>{projectStatusInfo.progress}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${projectStatusInfo.color}`}
                        style={{ width: projectStatusInfo.progress }}
                      />
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="mt-auto border-gray-800 border-t pt-4">
                    {project.estado === "CONCLUIDO" ? (
                      <button
                        className="btn-secondary flex w-full items-center justify-center gap-2 py-2.5 text-sm transition-colors hover:text-white"
                        type="button"
                      >
                        <Eye className="h-4 w-4" /> Ver Entrega
                      </button>
                    ) : project.estado === "EM_ANDAMENTO" ||
                      project.estado === "REVISAO_QA" ? (
                      <button
                        className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 text-sm shadow-lg shadow-purple-500/20"
                        type="button"
                      >
                        <Upload className="h-4 w-4" /> Enviar Tarefa
                      </button>
                    ) : project.estado === "CANCELADO" ? (
                      <button
                        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-red-900/50 bg-red-900/20 py-2.5 text-red-400 text-sm opacity-70"
                        disabled
                        type="button"
                      >
                        <AlertCircle className="h-4 w-4" /> Cancelado
                      </button>
                    ) : (
                      <button
                        className="btn-secondary flex w-full items-center justify-center gap-2 py-2.5 text-sm opacity-70 transition-all hover:bg-gray-800 hover:opacity-100"
                        type="button"
                      >
                        <Send className="h-4 w-4" /> Acompanhar Status
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
