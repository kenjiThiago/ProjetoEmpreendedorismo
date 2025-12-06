import { AnimatePresence, motion } from "framer-motion"
import {
  Building2,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  HelpCircle,
  Users,
  X,
  XCircle,
} from "lucide-react"

// Interface baseada no retorno do seu backend (classe_estudante.py)
export interface StudentProject {
  projeto_id: number
  titulo: string
  empresa: string
  estado: string
}

interface StudentProjectsModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  projects: StudentProject[]
}

export function StudentProjectsModal({
  isOpen,
  onClose,
  studentName,
  projects,
}: StudentProjectsModalProps) {
  // Helper para formatar o status visualmente
  const getStatusDisplay = (estado: string) => {
    switch (estado) {
      case "CONCLUIDO":
        return {
          color: "text-green-400 bg-green-400/10 border-green-400/20",
          icon: CheckCircle,
          label: "Concluído",
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
          label: "Revisão QA",
        }
      case "BUSCANDO_EQUIPE":
        return {
          color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
          icon: Users,
          label: "Formando Equipe",
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
          icon: HelpCircle,
          label: estado?.replace("_", " "),
        }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl"
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-gray-800 border-b p-6">
              <div>
                <h2 className="font-bold text-white text-xl">
                  Portfólio de Projetos
                </h2>
                <p className="text-gray-400 text-sm">
                  Histórico de {studentName} na plataforma
                </p>
              </div>
              <button
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                onClick={onClose}
                type="button"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Lista de Projetos */}
            <div className="custom-scrollbar max-h-[60vh] overflow-y-auto p-6">
              {projects.length > 0 ? (
                <div className="grid gap-4">
                  {projects.map((project) => {
                    const statusInfo = getStatusDisplay(project.estado)
                    const StatusIcon = statusInfo.icon

                    return (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col justify-between gap-4 rounded-xl border border-gray-800 bg-gray-800/30 p-4 transition-colors hover:border-gray-700 hover:bg-gray-800/50 sm:flex-row sm:items-center"
                        initial={{ opacity: 0, y: 10 }}
                        key={project.projeto_id}
                      >
                        <div className="flex-1">
                          <h3 className="mb-1 font-semibold text-white">
                            {project.titulo}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <Building2 className="h-3 w-3" />
                            {project.empresa}
                          </div>
                        </div>

                        <div className="shrink-0">
                          <span
                            className={`flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium text-xs ${statusInfo.color}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                          </span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 text-gray-600">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="font-medium text-lg text-white">
                    Nenhum projeto entregue
                  </h3>
                  <p className="text-gray-400">
                    Este estudante ainda não finalizou projetos na plataforma.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end border-gray-800 border-t bg-gray-900/50 p-6">
              <button
                className="rounded-xl bg-gray-800 px-6 py-2.5 font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                onClick={onClose}
                type="button"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
