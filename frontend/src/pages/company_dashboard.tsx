import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { CompanyHero } from "@/components/company_dashboard/company_hero"
import { CompanyProjects } from "@/components/company_dashboard/company_projects"
import { NewProjectModal } from "@/components/company_dashboard/new_project_modal"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { useCompanyProfile } from "@/http/use_company_dashboard_info"

interface CompanyDashboardProps {
  companyName: string
}

export function CompanyDashboard({ companyName }: CompanyDashboardProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false) // Estado do Modal

  const { data: company, isLoading, isError } = useCompanyProfile(companyName)

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="animate-pulse text-white">Carregando painel...</div>
      </div>
    )
  }

  if (isError || !company) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="text-red-400">Erro ao carregar empresa.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main>
        <CompanyHero
          company={company}
          onRequestProject={() => setIsModalOpen(true)} // Abrir modal
        />

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <CompanyProjects
            onSearchChange={(v) => updateURL("search", v)}
            onStatusChange={(v) => updateURL("status", v)}
            projects={company.projetos || []}
            searchTerm={filters.search}
            selectedStatus={filters.status}
          />
        </section>
      </main>

      <Footer />

      {/* Modal de Criação de Projeto */}
      <NewProjectModal
        companyName={companyName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
