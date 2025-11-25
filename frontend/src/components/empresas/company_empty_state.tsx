import { motion } from "framer-motion"
import { Briefcase, Building2 } from "lucide-react"

interface CompanyEmptyStateProps {
  activeTab: "companies" | "jobs"
  searchTerm?: string
}

export function CompanyEmptyState({
  activeTab,
  searchTerm,
}: CompanyEmptyStateProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="py-16 text-center"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      {activeTab === "companies" ? (
        <Building2 className="mx-auto mb-4 h-16 w-16 text-gray-600" />
      ) : (
        <Briefcase className="mx-auto mb-4 h-16 w-16 text-gray-600" />
      )}
      <h3 className="mb-2 font-semibold text-white text-xl">
        Nenhum{activeTab === "companies" ? "a empresa" : " projeto"} encontrad
        {activeTab === "companies" ? "a" : "o"}
      </h3>
      <p className="mb-6 text-gray-400">
        {searchTerm
          ? `Não encontramos ${activeTab === "companies" ? "empresas" : "projetos"} para "${searchTerm}"`
          : "Tente ajustar seus filtros ou termos de busca"}
      </p>
      <motion.button
        className="btn-primary"
        onClick={() => {
          window.dispatchEvent(new CustomEvent("companyClearFilters"))
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Limpar Filtros</span>
      </motion.button>
    </motion.div>
  )
}
