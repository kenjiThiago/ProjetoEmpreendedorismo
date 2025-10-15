'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CoursesHero from '@/app/cursos/components/CoursesHero'
import FilterBar from '@/components/filters/CourseFilterBar'
import CourseCard from '@/components/cards/CourseCard'
import Pagination from '@/components/pagination/Pagination'
import EmptyState from '@/components/states/CourseEmptyState'
import { useCourseFilters } from '@/hooks/useCourseFilters'

export default function CursosContent() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const coursesPerPage = 6

  // Custom hook para filtros com URL sync (removido initialSearchTerm)
  const {
    courses,
    error,
    totalCount,
    totalPages,
    currentPage,
    searchTerm,
    selectedCategory,
    selectedLevel,
    selectedAccess,
    sortBy,
    setSearchTerm,
    setSelectedCategory,
    setSelectedLevel,
    setSelectedAccess,
    setSortBy,
    setCurrentPage,
    clearAllFilters
  } = useCourseFilters(coursesPerPage)

  // Event listeners para comunicação entre componentes
  useEffect(() => {
    const handleSearchChange = (e: any) => setSearchTerm(e.detail)
    const handleCategoryChange = (e: any) => setSelectedCategory(e.detail)
    const handleLevelChange = (e: any) => setSelectedLevel(e.detail)
    const handleAccessChange = (e: any) => setSelectedAccess(e.detail)
    const handleSortChange = (e: any) => setSortBy(e.detail)
    const handleViewModeChange = (e: any) => setViewMode(e.detail)
    const handleToggleFilters = () => setShowFilters(v => !v)
    const handlePageChange = (e: any) => setCurrentPage(e.detail)
    const handleClearFilters = () => clearAllFilters()

    window.addEventListener('searchChange', handleSearchChange as EventListener)
    window.addEventListener('categoryChange', handleCategoryChange as EventListener)
    window.addEventListener('levelChange', handleLevelChange as EventListener)
    window.addEventListener('accessChange', handleAccessChange as EventListener)
    window.addEventListener('sortChange', handleSortChange as EventListener)
    window.addEventListener('viewModeChange', handleViewModeChange as EventListener)
    window.addEventListener('toggleFilters', handleToggleFilters)
    window.addEventListener('pageChange', handlePageChange as EventListener)
    window.addEventListener('clearFilters', handleClearFilters)

    return () => {
      window.removeEventListener('searchChange', handleSearchChange as EventListener)
      window.removeEventListener('categoryChange', handleCategoryChange as EventListener)
      window.removeEventListener('levelChange', handleLevelChange as EventListener)
      window.removeEventListener('accessChange', handleAccessChange as EventListener)
      window.removeEventListener('sortChange', handleSortChange as EventListener)
      window.removeEventListener('viewModeChange', handleViewModeChange as EventListener)
      window.removeEventListener('toggleFilters', handleToggleFilters)
      window.removeEventListener('pageChange', handlePageChange as EventListener)
      window.removeEventListener('clearFilters', handleClearFilters)
    }
  }, [clearAllFilters])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <main>
          <CoursesHero searchTerm={searchTerm} totalCourses={0} />
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-red-500 mb-4">Erro ao carregar cursos: {error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary px-6 py-3">
                Tentar Novamente
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main>
        <CoursesHero searchTerm={searchTerm} totalCourses={courses.length} />
        <FilterBar
          selectedCategory={selectedCategory}
          selectedLevel={selectedLevel}
          selectedAccess={selectedAccess}
          sortBy={sortBy}
          viewMode={viewMode}
          showFilters={showFilters}
          filteredCount={totalCount}
        />
        <section id="content-area" className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {totalCount > 0 ? (
              <>
                <motion.div
                  className={viewMode === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "space-y-6"
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  key={`${viewMode}-${currentPage}`}
                >
                  {courses.map((course, index) => (
                    <CourseCard key={index} index={index} course={course} layout={viewMode} />
                  ))}
                </motion.div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalCount}
                  itemsPerPage={6}
                  scrollTargetId="content-area"
                />
              </>
            ) : (
              <EmptyState searchTerm={searchTerm} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
