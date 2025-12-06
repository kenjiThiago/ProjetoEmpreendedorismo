import { Briefcase, Check, ShieldAlert, User, X } from "lucide-react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { useAdminData } from "@/http/use_admin"

export function AdminDashboard() {
  const {
    pendingProjects,
    pendingMembers,
    approveProject,
    rejectProject,
    approveMember,
    rejectMember,
  } = useAdminData()

  // Componente visual para quando estiver carregando (evita o "piscar")
  const LoadingList = () => (
    <div className="space-y-4 p-4">
      {[1, 2, 3].map((i) => (
        <div
          className="h-32 w-full animate-pulse rounded-xl border border-gray-800 bg-gray-900/50"
          key={i}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Cabeçalho da Página */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-3xl">Painel Administrativo</h1>
            <p className="text-gray-400">
              Gerencie aprovações pendentes da plataforma
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* --- COLUNA 1: PROJETOS PENDENTES --- */}
          <section className="flex h-[700px] flex-col rounded-2xl border border-gray-800 bg-gray-900/30 shadow-xl backdrop-blur-sm">
            {/* Cabeçalho da Coluna (Fixo) */}
            <div className="border-gray-800 border-b p-6">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold text-white text-xl">
                  <Briefcase className="h-5 w-5 text-blue-400" />
                  Projetos em Análise
                </h2>
                <span className="rounded-full bg-blue-500/10 px-3 py-1 font-bold text-blue-400 text-xs">
                  {pendingProjects.data?.length || 0}
                </span>
              </div>
            </div>

            {/* Área de Conteúdo com Scroll */}
            <div className="custom-scrollbar flex-1 overflow-y-auto p-4">
              {pendingProjects.isLoading ? (
                <LoadingList />
              ) : pendingProjects.data?.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                  <Briefcase className="mb-2 h-12 w-12 opacity-20" />
                  <p>Nenhum projeto pendente.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingProjects.data?.map((project) => (
                    <div
                      className="rounded-xl border border-gray-800 bg-gray-900 p-5 shadow-lg transition-colors hover:border-gray-700"
                      key={project.id}
                    >
                      <div className="mb-4">
                        <h3 className="line-clamp-1 font-bold text-lg text-white">
                          {project.titulo}
                        </h3>
                        <p className="mb-2 font-medium text-gray-400 text-sm">
                          {project.empresa_nome}
                        </p>
                        <p className="line-clamp-2 text-gray-500 text-sm">
                          {project.descricao}
                        </p>
                      </div>

                      <div className="flex gap-3 border-gray-800 border-t pt-4">
                        <button
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500/10 py-2 font-semibold text-green-400 text-sm transition-colors hover:bg-green-500/20"
                          onClick={() => approveProject(project.id)}
                          type="button"
                        >
                          <Check className="h-4 w-4" /> Aprovar
                        </button>
                        <button
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500/10 py-2 font-semibold text-red-400 text-sm transition-colors hover:bg-red-500/20"
                          onClick={() => rejectProject(project.id)}
                          type="button"
                        >
                          <X className="h-4 w-4" /> Rejeitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* --- COLUNA 2: MEMBROS PENDENTES --- */}
          <section className="flex h-[700px] flex-col rounded-2xl border border-gray-800 bg-gray-900/30 shadow-xl backdrop-blur-sm">
            {/* Cabeçalho da Coluna (Fixo) */}
            <div className="border-gray-800 border-b p-6">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold text-white text-xl">
                  <User className="h-5 w-5 text-purple-400" />
                  Candidaturas
                </h2>
                <span className="rounded-full bg-purple-500/10 px-3 py-1 font-bold text-purple-400 text-xs">
                  {pendingMembers.data?.length || 0}
                </span>
              </div>
            </div>

            {/* Área de Conteúdo com Scroll */}
            <div className="custom-scrollbar flex-1 overflow-y-auto p-4">
              {pendingMembers.isLoading ? (
                <LoadingList />
              ) : pendingMembers.data?.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                  <User className="mb-2 h-12 w-12 opacity-20" />
                  <p>Nenhuma candidatura pendente.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingMembers.data?.map((member) => (
                    <div
                      className="rounded-xl border border-gray-800 bg-gray-900 p-5 shadow-lg transition-colors hover:border-gray-700"
                      key={member.id}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-white">
                            {member.estudante_nome}
                          </h3>
                          <p className="mt-1 font-mono text-gray-400 text-xs">
                            {member.estudante_cpf}
                          </p>
                        </div>
                        <span className="rounded border border-gray-700 bg-gray-800 px-2 py-1 font-medium text-purple-300 text-xs">
                          {member.papel_no_projeto}
                        </span>
                      </div>

                      <div className="mb-4 rounded-lg border border-gray-800 bg-gray-950/50 p-3 text-gray-300 text-sm">
                        <span className="mb-1 block text-gray-500 text-xs uppercase tracking-wider">
                          Candidato para:
                        </span>
                        <span className="font-medium text-white">
                          {member.projeto_titulo}
                        </span>
                      </div>

                      <div className="flex gap-3 border-gray-800 border-t pt-4">
                        <button
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500/10 py-2 font-semibold text-green-400 text-sm transition-colors hover:bg-green-500/20"
                          onClick={() => approveMember(member.id)}
                          type="button"
                        >
                          <Check className="h-4 w-4" /> Aprovar
                        </button>
                        <button
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500/10 py-2 font-semibold text-red-400 text-sm transition-colors hover:bg-red-500/20"
                          onClick={() => rejectMember(member.id)}
                          type="button"
                        >
                          <X className="h-4 w-4" /> Rejeitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
