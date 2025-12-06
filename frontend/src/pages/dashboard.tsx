import { motion } from "framer-motion"
import { Briefcase, Sparkles } from "lucide-react"
import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { DashboardHero } from "@/components/dashboard/dashboard_hero"
import { DashboardProjects } from "@/components/dashboard/dashboard_projects"
import { WelcomeModal } from "@/components/dashboard/welcome_modal"
import { ProjectCard } from "@/components/empresas/project_card"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { useProjects } from "@/http/use_project_info"
import { useStudentProfile } from "@/http/use_student_data"
import { calculateMatchScore } from "@/lib/recommendation_engine"

interface DashboardPageProps {
  cpf: string
}

export function DashboardPageContent({
  cpf = "507.946.328-74",
}: DashboardPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<"my_projects" | "recommendations">(
    "my_projects"
  )

  const {
    data: student,
    isLoading: isLoadingStudent,
    isError,
  } = useStudentProfile(cpf)

  const { data: marketProjects, isLoading: isLoadingRecommendations } =
    useProjects({})

  const filters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "Todos",
  }

  const updateURL = (key: string, value: string) => {
    setSearchParams((prev) => {
      if (!value || value === "Todos") {
        prev.delete(key)
      } else {
        prev.set(key, value)
      }
      return prev
    })
  }

  const recommendedProjects = useMemo(() => {
    if (!(student && marketProjects?.projetos)) {
      return []
    }

    const myProjectIds = new Set(
      student.projetos?.map((p) => p.projeto_id) || []
    )

    const candidates = marketProjects.projetos.filter(
      (p) =>
        !myProjectIds.has(p.id) &&
        (p.estado === "BUSCANDO_EQUIPE")
    )

    const scored = candidates.map((project) => ({
      ...project,
      matchScore: calculateMatchScore(student, project),
    }))

    return scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6)
  }, [student, marketProjects])

  if (isLoadingStudent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="animate-pulse text-white">Carregando perfil...</div>
      </div>
    )
  }

  if (isError || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="text-red-400">Erro ao carregar dados do estudante.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <WelcomeModal />

      <main>
        <DashboardHero student={student} />

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-6 border-gray-800 border-b">
            <button
              className={`flex items-center gap-2 border-b-2 px-1 pb-4 transition-colors ${
                activeTab === "my_projects"
                  ? "border-purple-500 font-medium text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("my_projects")}
              type="button"
            >
              <Briefcase className="h-4 w-4" />
              Meus Projetos
            </button>

            <button
              className={`flex items-center gap-2 border-b-2 px-1 pb-4 transition-colors ${
                activeTab === "recommendations"
                  ? "border-purple-500 font-medium text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("recommendations")}
              type="button"
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
              Recomendados para Mim
            </button>
          </div>

          {activeTab === "my_projects" ? (
            <DashboardProjects
              onSearchChange={(v) => updateURL("search", v)}
              onStatusChange={(v) => updateURL("status", v)}
              projects={student.projetos || []}
              searchTerm={filters.search}
              selectedStatus={filters.status}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-white text-xl">
                  Oportunidades com o seu perfil
                </h2>
                <span className="text-gray-400 text-sm">
                  {recommendedProjects.length} sugestões baseadas nas suas
                  skills
                </span>
              </div>

              {isLoadingRecommendations ? (
                <div className="animate-pulse py-20 text-center text-gray-500">
                  Analisando compatibilidade...
                </div>
              ) : recommendedProjects.length > 0 ? (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                  initial={{ opacity: 0, y: 10 }}
                >
                  {recommendedProjects.map((project, index: number) => (
                    <ProjectCard
                      index={index}
                      key={project.id}
                      matchScore={project.matchScore}
                      project={project}
                      viewMode="grid"
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="rounded-xl border border-gray-800 border-dashed bg-gray-900/30 py-16 text-center">
                  <Briefcase className="mx-auto mb-3 h-12 w-12 text-gray-700" />
                  <p className="text-gray-400">
                    Nenhuma recomendação perfeita encontrada no momento.
                  </p>
                  <p className="mt-2 text-gray-600 text-sm">
                    Tente adicionar mais habilidades ao seu perfil para melhorar
                    o match.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
