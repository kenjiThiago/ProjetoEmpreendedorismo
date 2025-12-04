import {
  AlertCircle, // Importado
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Layers,
  Loader,
  Monitor,
  Share2,
  User,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth_context"
import { useApplyProject } from "@/http/use_apply_project"
import { useProjectDetails } from "@/http/use_project_details"
import { useStudentProfile } from "@/http/use_student_data"

export function ProjectDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, userType } = useAuth()
  const [isApplying, setIsApplying] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")

  const { data: project, isLoading, isError } = useProjectDetails(id || "")
  const { data: student } = useStudentProfile(user?.cpf || "")

  useEffect(() => {
    if (student?.papeis_projetos && student.papeis_projetos.length > 0) {
      setSelectedRole(student.papeis_projetos[0])
    }
  }, [student])

  const { mutate: apply, isPending: isMutationPending } = useApplyProject()

  // --- VERIFICAÇÃO DE ESTADO ---
  // Só permite inscrição se o estado for EXATAMENTE 'BUSCANDO_EQUIPE'
  const isRegistrationOpen = project?.estado === "BUSCANDO_EQUIPE"

  const handleApply = () => {
    if (!isAuthenticated || user === null) {
      toast.error("Você precisa estar logado para se inscrever.")
      navigate("/auth?mode=login")
      return
    }

    if (userType !== "student") {
      toast.error("Apenas estudantes podem se inscrever em projetos.")
      return
    }

    // Bloqueio extra de segurança
    if (!isRegistrationOpen) {
      toast.error("As inscrições para este projeto estão encerradas.")
      return
    }

    if (!selectedRole) {
      toast.error("Selecione um papel para atuar no projeto.")
      return
    }

    apply(
      {
        projeto_id: Number(project?.id || project?.projeto_id),
        estudante_cpf: user.cpf,
        papel_no_projeto: selectedRole,
      },
      {
        onSuccess: () => {
          setIsApplying(true)
          toast.success(`Candidatura enviada como ${selectedRole}!`)
        },
        onError: (error) => {
          toast.error(`Erro: ${error.message}`)
        },
      }
    )
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white">
        <h2 className="mb-4 font-bold text-2xl">Projeto não encontrado</h2>
        <button
          className="text-purple-400 hover:underline"
          onClick={() => navigate(-1)}
          type="button"
        >
          Voltar
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className="pb-20">
        <section className="relative border-gray-800 border-b bg-linear-to-b from-gray-900 via-blue-950/20 to-gray-900 pt-12 pb-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <button
              className="mb-8 flex items-center text-gray-400 text-sm transition-colors hover:text-white"
              onClick={() => navigate(-1)}
              type="button"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para busca
            </button>

            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  {/* Badge de Estado */}
                  <span
                    className={`rounded border px-3 py-1 font-medium text-xs ${
                      isRegistrationOpen
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}
                  >
                    {isRegistrationOpen
                      ? "Inscrições Abertas"
                      : project.estado?.replace("_", " ")}
                  </span>

                  <span className="rounded border border-purple-500/30 bg-purple-500/10 px-3 py-1 font-medium text-purple-400 text-xs">
                    {project.complexidade}
                  </span>
                  <span className="rounded border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-medium text-blue-400 text-xs">
                    {project.modalidade}
                  </span>
                </div>
                <h1 className="mb-4 font-bold text-3xl text-white md:text-4xl">
                  {project.titulo}
                </h1>
                <div className="flex items-center text-gray-400">
                  <Building2 className="mr-2 h-5 w-5 text-gray-500" />
                  <span className="font-medium text-lg text-white">
                    {project.empresa_nome}
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-col items-end gap-4 md:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Valor da Bolsa:</span>
                  <span className="font-bold text-2xl text-green-400">
                    {formatCurrency(project.orcamento_estudantes)}
                  </span>
                </div>

                {!isApplying &&
                  userType === "student" &&
                  isRegistrationOpen && (
                    <div className="w-full md:w-64">
                      <label className="mb-1 block text-gray-400 text-xs">
                        Candidatar-se como:
                      </label>
                      <div className="relative">
                        <User className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
                        <select
                          className="w-full appearance-none rounded-lg border border-gray-700 bg-gray-800 py-2.5 pr-4 pl-9 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          onChange={(e) => setSelectedRole(e.target.value)}
                          value={selectedRole}
                        >
                          {student?.papeis_projetos?.map((papel, index) => (
                            <option key={index} value={papel}>
                              {papel}
                            </option>
                          ))}
                          {(!student?.papeis_projetos ||
                            student.papeis_projetos.length === 0) && (
                            <option disabled value="">
                              Complete seu perfil
                            </option>
                          )}
                        </select>
                      </div>
                    </div>
                  )}

                {/* LÓGICA DO BOTÃO DE INSCRIÇÃO */}
                {isApplying ? (
                  <button
                    className="flex w-full cursor-default items-center justify-center gap-2 rounded-xl bg-green-500/20 px-8 py-4 font-bold text-green-400 transition-all md:w-64"
                    disabled
                    type="button"
                  >
                    <CheckCircle className="h-5 w-5" /> Candidatura Enviada
                  </button>
                ) : isRegistrationOpen ? (
                  <button
                    className="w-full rounded-xl bg-linear-to-r from-purple-500 to-indigo-600 px-8 py-4 font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-70 md:w-64"
                    disabled={isMutationPending}
                    onClick={handleApply}
                    type="button"
                  >
                    {isMutationPending ? (
                      <Loader className="mx-auto h-5 w-5 animate-spin" />
                    ) : (
                      "Quero Participar"
                    )}
                  </button>
                ) : (
                  <button
                    className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-8 py-4 font-bold text-gray-400 md:w-64"
                    disabled
                    type="button"
                  >
                    <AlertCircle className="h-5 w-5" /> Inscrições Encerradas
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ... Resto do componente (Resumo, Skills) mantido igual ... */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-12 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="space-y-12 md:col-span-2">
            <section>
              <h3 className="mb-4 font-semibold text-white text-xl">
                Sobre o Projeto
              </h3>
              <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 text-gray-300 leading-relaxed">
                {project.descricao}
              </div>
            </section>
            <section>
              <h3 className="mb-4 font-semibold text-white text-xl">
                Skills Necessárias
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.habilidades?.map((skill: any) => (
                  <span
                    className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-300 text-sm"
                    key={skill.id_habilidade}
                  >
                    {skill.nome}
                  </span>
                ))}
              </div>
            </section>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <h3 className="mb-6 font-semibold text-white">Resumo</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-gray-800 border-b pb-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Início</span>
                  </div>
                  <span className="text-white">
                    {formatDate(project.data_inicio)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-gray-800 border-b pb-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>Prazo</span>
                  </div>
                  <span className="text-white">
                    {formatDate(project.prazo_entrega)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-gray-800 border-b pb-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Layers className="h-4 w-4" />
                    <span>Complexidade</span>
                  </div>
                  <span className="text-white">{project.complexidade}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Monitor className="h-4 w-4" />
                    <span>Modalidade</span>
                  </div>
                  <span className="text-white">{project.modalidade}</span>
                </div>
              </div>
            </div>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900 py-3 font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                toast.success("Link copiado!")
              }}
              type="button"
            >
              <Share2 className="h-4 w-4" /> Compartilhar Projeto
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
