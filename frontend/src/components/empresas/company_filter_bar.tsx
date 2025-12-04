import { AnimatePresence, motion } from "framer-motion"
import { Grid3X3, List, SlidersHorizontal, X } from "lucide-react"
import { useState } from "react"

// Dados estáticos fora do componente para não recriar a cada render
interface CompanyFilterBarProps {
  activeTab: "companies" | "projects"
  // Valores
  selectedIndustry: string
  selectedSize: string
  selectedLocation: string
  selectedModality: string
  selectedComplexity: string
  selectedStatus: string

  // Opções
  industryOptions: string[]
  sizeOptions: string[]
  locationOptions: string[]
  modalityOptions: string[]
  complexityOptions: string[]

  viewMode: "grid" | "list"
  filteredCount: number

  onFilterChange: (key: string, value: string) => void
  onViewModeChange: (mode: "grid" | "list") => void
  onClearFilters: () => void
}

export function CompanyFilterBar({
  activeTab,
  selectedIndustry,
  selectedSize,
  selectedLocation,
  selectedModality,
  selectedComplexity,
  selectedStatus,
  industryOptions,
  sizeOptions,
  locationOptions,
  modalityOptions,
  complexityOptions,
  viewMode,
  filteredCount,
  onFilterChange,
  onViewModeChange,
  onClearFilters,
}: CompanyFilterBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Helper para formatar o texto dos status (Backend -> Frontend Bonito)
  const formatStatus = (status: string) => {
    const map: Record<string, string> = {
      Status: "Status do Projeto",
      BUSCANDO_EQUIPE: "Vagas Abertas",
      EM_ANDAMENTO: "Em Desenvolvimento",
      CONCLUIDO: "Concluído",
      ANALISE: "Em Análise",
      REVISAO_QA: "Revisão/QA",
      CANCELADO: "Cancelado",
    }
    return map[status] || status.replace("_", " ")
  }

  // Helper para formatar Complexidade (Capitalize)
  const formatComplexity = (level: string) => {
    if (level === "Nível") return "Nível de Dificuldade"
    // Transforma "BAIXA" em "Baixa", "MEDIA" em "Média", etc.
    const map: Record<string, string> = {
      BAIXA: "Baixa",
      MEDIA: "Média",
      ALTA: "Alta",
    }
    return (
      map[level] || level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
    )
  }

  const statusOptions = [
    "Status",
    "BUSCANDO_EQUIPE",
    "EM_ANDAMENTO",
    "CONCLUIDO",
  ]

  const SelectFilter = ({
    value,
    options,
    filterKey,
    formatter,
    className = "",
  }: any) => (
    <select
      className={`rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      onChange={(e) => onFilterChange(filterKey, e.target.value)}
      value={value}
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {formatter ? formatter(opt) : opt}
        </option>
      ))}
    </select>
  )

  return (
    <section className="sticky top-[72px] z-30 border-gray-800/50 border-b bg-gray-900/50 backdrop-blur-lg transition-all">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-4">
            <motion.button
              className="flex items-center space-x-2 rounded-lg bg-gray-800 px-4 py-2 text-white lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filtros</span>
            </motion.button>

            <div className="hidden items-center space-x-4 lg:flex">
              {activeTab === "companies" ? (
                <>
                  <SelectFilter
                    filterKey="industry"
                    options={industryOptions}
                    value={selectedIndustry}
                  />
                  <SelectFilter
                    filterKey="size"
                    options={sizeOptions}
                    value={selectedSize}
                  />
                  <SelectFilter
                    filterKey="location"
                    options={locationOptions}
                    value={selectedLocation}
                  />
                </>
              ) : (
                <>
                  {/* Filtro de Status com chave 'estado' para o backend */}
                  <SelectFilter
                    filterKey="estado"
                    formatter={formatStatus}
                    options={statusOptions}
                    value={selectedStatus}
                  />
                  <SelectFilter
                    filterKey="modality"
                    options={modalityOptions}
                    value={selectedModality}
                  />
                  <SelectFilter
                    filterKey="complexity"
                    formatter={formatComplexity}
                    options={complexityOptions}
                    value={selectedComplexity}
                  />
                </>
              )}

              <button
                className="flex items-center space-x-1 px-3 py-2 text-blue-400 text-sm transition-colors hover:text-blue-300"
                onClick={onClearFilters}
                type="button"
              >
                <X className="h-4 w-4" />
                <span>Limpar</span>
              </button>
            </div>
          </div>

          <div className="flex w-full items-center justify-between gap-4 lg:w-auto">
            <div className="text-gray-400 text-sm">
              <span className="font-medium text-white">{filteredCount}</span>{" "}
              {activeTab === "companies" ? "empresa" : "projeto"}
              {filteredCount !== 1 ? "s" : ""}
            </div>

            <div className="flex items-center rounded-lg bg-gray-800 p-1">
              <button
                className={`rounded p-2 ${viewMode === "grid" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}
                onClick={() => onViewModeChange("grid")}
                type="button"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                className={`rounded p-2 ${viewMode === "list" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}
                onClick={() => onViewModeChange("list")}
                type="button"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              animate={{ height: "auto", opacity: 1 }}
              className="mt-4 overflow-hidden border-gray-700/50 border-t pt-4 lg:hidden"
              exit={{ height: 0, opacity: 0 }}
              initial={{ height: 0, opacity: 0 }}
            >
              <div className="mb-4 grid grid-cols-1 gap-4">
                {activeTab === "companies" ? (
                  <>
                    <SelectFilter
                      filterKey="industry"
                      options={industryOptions}
                      value={selectedIndustry}
                    />
                    <SelectFilter
                      filterKey="size"
                      options={sizeOptions}
                      value={selectedSize}
                    />
                    <SelectFilter
                      filterKey="location"
                      options={locationOptions}
                      value={selectedLocation}
                    />
                  </>
                ) : (
                  <>
                    <SelectFilter
                      filterKey="estado"
                      formatter={formatStatus}
                      options={statusOptions}
                      value={selectedStatus}
                    />
                    <SelectFilter
                      filterKey="modality"
                      options={modalityOptions}
                      value={selectedModality}
                    />
                    <SelectFilter
                      filterKey="complexity"
                      formatter={formatComplexity}
                      options={complexityOptions}
                      value={selectedComplexity}
                    />
                  </>
                )}
                <button
                  className="flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-700 py-2 text-red-400"
                  onClick={() => {
                    onClearFilters()
                    setIsMobileMenuOpen(false)
                  }}
                  type="button"
                >
                  <X className="h-4 w-4" />
                  <span>Limpar Filtros</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
