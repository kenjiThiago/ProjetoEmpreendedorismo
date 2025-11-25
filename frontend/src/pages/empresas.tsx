import { motion } from "framer-motion"
import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { CompaniesHero } from "@/components/empresas/companies_hero"
import { CompanyCard } from "@/components/empresas/company_card"
import { CompanyEmptyState } from "@/components/empresas/company_empty_state"
import { CompanyFilterBar } from "@/components/empresas/company_filter_bar"
import { CompanyTabs } from "@/components/empresas/company_tabs"
import { ProjectCard } from "@/components/empresas/project_card"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Pagination } from "@/components/pagination"
import { useCompanies } from "@/http/use_company_info"
import { useProjects } from "@/http/use_project_info"

export function CompanyPageContent() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const activeTab =
    (searchParams.get("tab") as "companies" | "jobs") || "jobs"

  const filters = {
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "Localização",
    industry: searchParams.get("industry") || "Setores",
    size: searchParams.get("size") || "Porte",
    complexity:
      searchParams.get("complexity") || searchParams.get("jobLevel") || "Nível",
    modality:
      searchParams.get("modality") ||
      searchParams.get("jobType") ||
      "Modalidade",
    page: Number(searchParams.get("page")) || 1,
  }

  const companiesQuery = useCompanies(activeTab === "companies" ? filters : {})
  const projectsQuery = useProjects(activeTab === "jobs" ? filters : {})

  const getUniqueOptions = (items: any[], key: string, label: string) => {
    if (!items || items.length === 0) {
      return [label]
    }

    const uniqueValues = Array.from(new Set(items.map((item) => item[key])))

    const cleanValues = uniqueValues.filter((v) => v).sort()

    return [label, ...cleanValues]
  }

  const dynamicOptions = useMemo(() => {
    const rawCompanies = companiesQuery.data?.empresas || []
    const rawProjects = projectsQuery.data?.projetos || []

    return {
      industries: getUniqueOptions(rawCompanies, "setor", "Setores"),
      sizes: getUniqueOptions(rawCompanies, "porte", "Porte"),
      locations: getUniqueOptions(rawCompanies, "localizacao", "Localização"),

      modalities: getUniqueOptions(rawProjects, "modalidade", "Modalidade"),
      complexities: getUniqueOptions(rawProjects, "complexidade", "Nível"),
    }
  }, [companiesQuery.data, projectsQuery.data])

  const updateURL = (key: string, value: string | number) => {
    setSearchParams((prev) => {
      if (
        !value ||
        ["Localização", "Setores", "Porte", "Modalidade", "Nível"].includes(
          String(value)
        )
      ) {
        prev.delete(key)
      } else {
        prev.set(key, String(value))
      }

      if (key !== "page") {
        prev.set("page", "1")
      }
      return prev
    })
  }

  let totalItems = 0
  let currentItems: any[] = []
  const itemsPerPage = 6

  if (activeTab === "companies") {
    const rawCompanies = companiesQuery.data?.empresas || []
    totalItems = rawCompanies.length

    const startIndex = (filters.page - 1) * itemsPerPage
    currentItems = rawCompanies.slice(startIndex, startIndex + itemsPerPage)
  } else {
    const rawProjects = projectsQuery.data?.projetos || []
    totalItems = rawProjects.length

    const startIndex = (filters.page - 1) * itemsPerPage
    currentItems = rawProjects.slice(startIndex, startIndex + itemsPerPage)
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1

  let content
  const currentQuery =
    activeTab === "companies" ? companiesQuery : projectsQuery

  if (currentQuery.isLoading) {
    content = (
      <div className="flex justify-center py-20">
        <div className="animate-pulse text-lg text-white">
          Carregando dados...
        </div>
      </div>
    )
  } else if (currentQuery.isError) {
    content = (
      <div className="flex justify-center py-20">
        <div className="text-red-400">
          Erro ao carregar dados. Tente novamente.
        </div>
      </div>
    )
  } else if (totalItems === 0) {
    content = (
      <CompanyEmptyState activeTab={activeTab} searchTerm={filters.search} />
    )
  } else {
    content = (
      <>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 gap-8 md:grid-cols-3"
              : "space-y-6"
          }
          initial={{ opacity: 0, y: 20 }}
          key={`${activeTab}-${filters.page}`}
        >
          {activeTab === "companies"
            ? currentItems.map((company, index) => (
                <CompanyCard
                  company={company}
                  index={index}
                  key={index}
                  viewMode={viewMode}
                />
              ))
            : currentItems.map((project, index) => (
                <ProjectCard
                  index={index}
                  key={index}
                  project={project}
                  viewMode={viewMode}
                />
              ))}
        </motion.div>

        <Pagination
          currentPage={filters.page}
          itemsPerPage={itemsPerPage}
          onPageChange={(p) => updateURL("page", p)}
          scrollTargetId="company-content"
          totalItems={totalItems}
          totalPages={totalPages}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main>
        <CompaniesHero
          onSearch={(v) => updateURL("search", v)}
          searchTerm={filters.search}
        />

        <CompanyTabs
          activeTab={activeTab}
          onTabChange={(t) => updateURL("tab", t)}
        />

        <CompanyFilterBar
          activeTab={activeTab === "jobs" ? "projects" : "companies"}
          complexityOptions={dynamicOptions.complexities}
          filteredCount={totalItems}
          industryOptions={dynamicOptions.industries}
          locationOptions={dynamicOptions.locations}
          modalityOptions={dynamicOptions.modalities}
          onClearFilters={() => {
            setSearchParams((prev) => {
              const newParams = new URLSearchParams()
              const tab = prev.get("tab")
              if (tab) {
                newParams.set("tab", tab)
              }
              return newParams
            })
          }}
          onFilterChange={(key, value) => updateURL(key, value)}
          onViewModeChange={setViewMode}
          selectedComplexity={filters.complexity}
          selectedIndustry={filters.industry}
          selectedLocation={filters.location}
          selectedModality={filters.modality}
          selectedSize={filters.size}
          sizeOptions={dynamicOptions.sizes}
          viewMode={viewMode}
        />

        <section className="py-12" id="company-content">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {content}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
