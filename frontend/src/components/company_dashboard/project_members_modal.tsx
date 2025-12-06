import { AnimatePresence, motion } from "framer-motion"
import {
  CheckCircle,
  Clock,
  Mail,
  MoreVertical,
  Shield,
  User,
  X,
} from "lucide-react"
import { useProjectMembers } from "@/http/use_project_members"

interface ProjectMembersModalProps {
  projectId: number | null
  projectTitle: string
  onClose: () => void
}

export function ProjectMembersModal({
  projectId,
  projectTitle,
  onClose,
}: ProjectMembersModalProps) {
  const { data: members, isLoading } = useProjectMembers(projectId)

  // Helper para cor do status do membro
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ATIVO":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "EM ANALISE":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "REMOVIDO":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getInitials = (name: string) => {
    if (!name) {
      return "U"
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <AnimatePresence>
      {projectId && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl"
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-gray-800 border-b p-6">
              <div>
                <h2 className="font-bold text-white text-xl">
                  Equipe do Projeto
                </h2>
                <p className="text-gray-400 text-sm">{projectTitle}</p>
              </div>
              <button
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                onClick={onClose}
                type="button"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Lista de Membros */}
            <div className="custom-scrollbar max-h-[60vh] overflow-y-auto p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div
                      className="flex animate-pulse items-center gap-4 rounded-xl border border-gray-800 bg-gray-800/50 p-4"
                      key={i}
                    >
                      <div className="h-12 w-12 rounded-full bg-gray-700" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 rounded bg-gray-700" />
                        <div className="h-3 w-24 rounded bg-gray-700" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : members && members.length > 0 ? (
                <div className="grid gap-4">
                  {members.map((member) => (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-800/30 p-4 transition-colors hover:border-gray-700 hover:bg-gray-800/50"
                      initial={{ opacity: 0, y: 10 }}
                      key={member.estudante_cpf} // Usando CPF como key já que ID pode não vir no mock
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-blue-600 font-bold text-white shadow-lg">
                          {getInitials(member.nome)}
                        </div>

                        <div>
                          <h3 className="font-semibold text-white">
                            {member.nome}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3 text-purple-400" />
                              {/* Propriedade corrigida */}
                              {member.papel_no_projeto}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {member.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium text-xs ${getStatusColor(member.estado)}`}
                        >
                          {member.estado === "EM ANALISE" ? (
                            <Clock className="h-3 w-3" />
                          ) : (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          {member.estado}
                        </span>

                        <button
                          className="text-gray-500 hover:text-white"
                          type="button"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 text-gray-600">
                    <User className="h-8 w-8" />
                  </div>
                  <h3 className="font-medium text-lg text-white">
                    Nenhum integrante encontrado
                  </h3>
                  <p className="text-gray-400">
                    Este projeto ainda não possui membros ativos ou candidatos.
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
