'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CompaniesHero from '@/app/empresas/components/CompaniesHero'
import CompanyTabs from '@/app/empresas/components/CompanyTabs'
import CompanyFilterBar from '@/components/filters/CompanyFilterBar'
import CompanyCard from '@/components/cards/CompanyCard'
import JobCard from '@/components/cards/JobCard'
import Pagination from '@/components/pagination/Pagination'
import CompanyEmptyState from '@/components/states/CompanyEmptyState'
import { useCompanyFilters } from '@/hooks/useCompanyFilters'
import { useJobFilters } from '@/hooks/useJobFilters'

export default function CompanyPageContent() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const itemsPerPage = 6

  // Adicionar hooks para navegação e query params
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')

  // Tab inicial baseado na URL
  const [activeTab, setActiveTab] = useState<'companies' | 'jobs'>(
    (tabFromUrl as 'companies' | 'jobs') || 'companies'
  )

  // Hook para empresas (sempre ativo)
  const companyFilters = useCompanyFilters(itemsPerPage)

  // Hook para vagas (ativo apenas quando necessário)
  const jobFilters = useJobFilters(itemsPerPage)

  // Effect para sincronizar a aba com a URL
  useEffect(() => {
    if (tabFromUrl && ['companies', 'jobs'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl as 'companies' | 'jobs')
    }
  }, [tabFromUrl])

  // Effect para controlar quando ativar/desativar o hook de vagas
  useEffect(() => {
    if (activeTab === 'jobs') {
      jobFilters.activate()
      companyFilters.deactivate()
    } else {
      jobFilters.deactivate()
      companyFilters.activate()
    }
  }, [activeTab, jobFilters])

  // Determinar qual hook usar baseado na aba ativa
  const activeFilters = activeTab === 'companies' ? companyFilters : jobFilters
  const currentItems = activeTab === 'companies' ? companyFilters.companies : jobFilters.jobs

  // Event listeners para comunicação entre componentes
  useEffect(() => {
    const handleSearchChange = (e: CustomEvent) => { activeFilters.setSearchTerm(e.detail) }
    const handleTabChange = (e: CustomEvent) => {
      const newTab = e.detail
      setActiveTab(newTab)

      // Atualizar a URL quando a aba mudar
      const href = `/empresas?tab=${newTab}`
      router.push(href, { scroll: false })
    }
    const handleIndustryChange = (e: CustomEvent) => {
      if (activeTab === 'companies') {
        companyFilters.setSelectedIndustry(e.detail)
      }
    }
    const handleSizeChange = (e: CustomEvent) => {
      if (activeTab === 'companies') {
        companyFilters.setSelectedSize(e.detail)
      }
    }
    const handleLocationChange = (e: CustomEvent) => { activeFilters.setSelectedLocation(e.detail) }
    const handleJobTypeChange = (e: CustomEvent) => {
      if (activeTab === 'jobs') {
        jobFilters.setSelectedJobType(e.detail)
      }
    }
    const handleJobLevelChange = (e: CustomEvent) => {
      if (activeTab === 'jobs') {
        jobFilters.setSelectedJobLevel(e.detail)
      }
    }
    const handleViewModeChange = (e: CustomEvent) => { setViewMode(e.detail) }
    const handleToggleFilters = () => { setShowFilters(!showFilters) }
    const handlePageChange = (e: CustomEvent) => { activeFilters.setCurrentPage(e.detail) }
    const handleClearFilters = () => { activeFilters.clearAllFilters() }

    // Add event listeners
    window.addEventListener('companySearchChange', handleSearchChange as EventListener)
    window.addEventListener('companyTabChange', handleTabChange as EventListener)
    window.addEventListener('companyIndustryChange', handleIndustryChange as EventListener)
    window.addEventListener('companySizeChange', handleSizeChange as EventListener)
    window.addEventListener('companyLocationChange', handleLocationChange as EventListener)
    window.addEventListener('companyJobTypeChange', handleJobTypeChange as EventListener)
    window.addEventListener('companyJobLevelChange', handleJobLevelChange as EventListener)
    window.addEventListener('companyViewModeChange', handleViewModeChange as EventListener)
    window.addEventListener('companyToggleFilters', handleToggleFilters)
    window.addEventListener('pageChange', handlePageChange as EventListener)
    window.addEventListener('companyClearFilters', handleClearFilters)

    // Cleanup
    return () => {
      window.removeEventListener('companySearchChange', handleSearchChange as EventListener)
      window.removeEventListener('companyTabChange', handleTabChange as EventListener)
      window.removeEventListener('companyIndustryChange', handleIndustryChange as EventListener)
      window.removeEventListener('companySizeChange', handleSizeChange as EventListener)
      window.removeEventListener('companyLocationChange', handleLocationChange as EventListener)
      window.removeEventListener('companyJobTypeChange', handleJobTypeChange as EventListener)
      window.removeEventListener('companyJobLevelChange', handleJobLevelChange as EventListener)
      window.removeEventListener('companyViewModeChange', handleViewModeChange as EventListener)
      window.removeEventListener('companyToggleFilters', handleToggleFilters)
      window.removeEventListener('pageChange', handlePageChange as EventListener)
      window.removeEventListener('companyClearFilters', handleClearFilters)
    }
  }, [activeTab, activeFilters, companyFilters, jobFilters])

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main>
        {/* Hero Section */}
        <CompaniesHero searchTerm={activeFilters.searchTerm} />

        {/* Tabs */}
        <CompanyTabs
          activeTab={activeTab}
        />

        {/* Filters and Controls */}
        <CompanyFilterBar
          activeTab={activeTab}
          selectedIndustry={activeTab === 'companies' ? companyFilters.selectedIndustry : 'Setores'}
          selectedSize={activeTab === 'companies' ? companyFilters.selectedSize : 'Porte'}
          selectedLocation={activeFilters.selectedLocation}
          selectedJobType={activeTab === 'jobs' ? jobFilters.selectedJobType : 'Modalidade'}
          selectedJobLevel={activeTab === 'jobs' ? jobFilters.selectedJobLevel : 'Nível'}
          viewMode={viewMode}
          showFilters={showFilters}
          filteredCount={activeFilters.totalCount}
        />

        {/* Content */}
        <section id="company-content" className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {currentItems.length > 0 ? (
              <>
                {activeTab === 'companies' ? (
                  <motion.div
                    className={viewMode === 'grid'
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      : "space-y-6"
                    }
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    key={`companies-${activeFilters.currentPage}-${viewMode}`}
                  >
                    {currentItems.map((company, index) => (
                      <CompanyCard
                        key={index}
                        index={index}
                        company={company as any}
                        viewMode={viewMode}
                      />
                    ))}
                  </motion.div>
                ) : (
                   <motion.div
                     className="space-y-6"
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6 }}
                     key={`jobs-${activeFilters.currentPage}`}
                   >
                     {currentItems.map((job) => (
                       <JobCard
                         key={job.id}
                         job={job as any}
                       />
                     ))}
                   </motion.div>
                )}

                {/* Pagination */}
                <Pagination
                  currentPage={activeFilters.currentPage}
                  totalPages={activeFilters.totalPages}
                  totalItems={activeFilters.totalCount}
                  itemsPerPage={itemsPerPage}
                  scrollTargetId="company-content"
                />
              </>
            ) : (
              /* Empty State */
              <CompanyEmptyState
                activeTab={activeTab}
                searchTerm={activeFilters.searchTerm}
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
