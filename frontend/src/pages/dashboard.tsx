import { useSearchParams } from "react-router-dom"
import { DashboardHero } from "@/components/dashboard/dashboard_hero"
import { DashboardProjects } from "@/components/dashboard/dashboard_projects"
import { WelcomeModal } from "@/components/dashboard/welcome_modal"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { useStudentProfile } from "@/http/use_student_data"

interface DashboardPageProps {
  cpf: string
}

export function DashboardPageContent({
  cpf = "507.946.328-74",
}: DashboardPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  // 1. Hook Único (Traz Perfil + Projetos Mockados)
  const { data: student, isLoading, isError } = useStudentProfile(cpf)

  // 2. Filtros da URL
  const filters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "Todos",
    category: searchParams.get("category") || "Todos",
  }

  // 3. Update URL
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

  // Loading / Error
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="animate-pulse text-white">Carregando perfil...</div>
      </div>
    )
  }

  if (isError || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="text-red-400">Erro ao carregar dados.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <WelcomeModal />

      <main>
        {/* Passamos o objeto completo do aluno */}
        <DashboardHero student={student} />

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* O hook useStudentProfile injetou os projetos em student.projetos */}
          <DashboardProjects
            // onCategoryChange={(v) => updateURL("category", v)}
            onSearchChange={(v) => updateURL("search", v)}
            onStatusChange={(v) => updateURL("status", v)}
            projects={student.projetos || []}
            searchTerm={filters.search}
            // selectedCategory={filters.category}
            selectedStatus={filters.status}
          />
        </section>
      </main>

      <Footer />
    </div>
  )
}
