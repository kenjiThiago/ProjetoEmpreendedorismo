import { motion } from "framer-motion"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  HelpCircle,
  Search,
  Users,
  XCircle,
} from "lucide-react"
import { useState } from "react"
import type { CompanyProject } from "@/http/types/get_company_dashboard"
import type { ProjectStatus } from "@/http/types/get_student_info"
import { ProjectMembersModal } from "./project_members_modal"

interface CompanyProjectsProps {
  projects: CompanyProject[]
  searchTerm: string
  selectedStatus: string
  onSearchChange: (v: string) => void
  onStatusChange: (v: string) => void
}

export function CompanyProjects({
  projects,
  searchTerm,
  selectedStatus,
  onSearchChange,
  onStatusChange,
}: CompanyProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<CompanyProject | null>(
    null
  )

  const getStatusDisplay = (estado: ProjectStatus) => {
    switch (estado) {
      case "ANALISE":
        return {
          color: "text-orange-400 bg-orange-400/10 border-orange-400/20",
          icon: HelpCircle,
          label: "Em Análise",
        }
      case "BUSCANDO_EQUIPE":
        return {
          color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
          icon: Users,
          label: "Montando Squad",
        }
      case "EM_ANDAMENTO":
        return {
          color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
          icon: Clock,
          label: "Em Desenvolvimento",
        }
      case "REVISAO_QA":
        return {
          color: "text-purple-400 bg-purple-400/10 border-purple-400/20",
          icon: Eye,
          label: "Controle de Qualidade",
        }
      case "CONCLUIDO":
        return {
          color: "text-green-400 bg-green-400/10 border-green-400/20",
          icon: CheckCircle,
          label: "Entregue",
        }
      case "CANCELADO":
        return {
          color: "text-red-400 bg-red-400/10 border-red-400/20",
          icon: XCircle,
          label: "Cancelado",
        }
      default:
        return {
          color: "text-gray-400 bg-gray-400/10 border-gray-400/20",
          icon: AlertCircle,
          label: estado,
        }
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus =
      selectedStatus === "Todos" || project.estado === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
      >
        {/* Header e Filtros */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h2 className="font-bold text-2xl text-white">
            Acompanhamento de Projetos
          </h2>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
              <input
                className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 md:w-64"
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar projeto..."
                value={searchTerm}
              />
            </div>

            <select
              className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => onStatusChange(e.target.value)}
              value={selectedStatus}
            >
              <option value="Todos">Todos os Status</option>
              <option value="ANALISE">Em Análise</option>
              <option value="BUSCANDO_EQUIPE">Montando Squad</option>
              <option value="EM_ANDAMENTO">Em Desenvolvimento</option>
              <option value="REVISAO_QA">Em Revisão (QA)</option>
              <option value="CONCLUIDO">Entregues</option>
              <option value="CANCELADO">Cancelados</option>
            </select>
          </div>
        </div>

        {/* Lista */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredProjects.map((project) => {
              const projectId = project.id
              const statusInfo = getStatusDisplay(project.estado)
              const StatusIcon = statusInfo.icon

              return (
                <div
                  className="group flex flex-col items-start justify-between gap-4 rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-gray-700 hover:bg-gray-900/80 md:flex-row md:items-center"
                  key={projectId}
                >
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-bold text-lg text-white transition-colors group-hover:text-blue-400">
                        {project.titulo}
                      </h3>
                      <span
                        className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-medium text-xs ${statusInfo.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="line-clamp-1 text-gray-400 text-sm">
                      {project.descricao}
                    </p>
                  </div>

                  <div className="mt-2 flex w-full items-center gap-6 border-gray-800 border-t pt-4 md:mt-0 md:w-auto md:border-t-0 md:pt-0">
                    <div className="mr-2 flex flex-col items-center border-gray-800 border-r px-4 pr-6">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="font-bold text-white">
                          {project.candidatos_count}
                        </span>
                      </div>
                      <span className="font-medium text-[10px] text-gray-500 uppercase tracking-wider">
                        Aplicações
                      </span>
                    </div>

                    <button
                      className="btn-secondary flex items-center gap-2 whitespace-nowrap px-4 py-2 text-sm transition-colors hover:bg-gray-800 hover:text-white"
                      onClick={() => setSelectedProject(project)}
                      type="button"
                    >
                      <Users className="h-4 w-4" />
                      <span>Ver Integrantes</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-800 border-dashed bg-gray-900/30 py-16 text-center">
            <p className="text-gray-500">Nenhum projeto encontrado.</p>
          </div>
        )}
      </motion.div>

      <ProjectMembersModal
        onClose={() => setSelectedProject(null)}
        // Garante que passamos o ID correto (prioriza 'id' que vem do backend principal)
        projectId={
          selectedProject
            ? selectedProject.id || selectedProject.id
            : null
        }
        projectTitle={selectedProject?.titulo || ""}
      />
    </>
  )
}
