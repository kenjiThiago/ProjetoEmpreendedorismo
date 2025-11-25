import { Briefcase, Building2 } from "lucide-react"

interface CompanyTabsProps {
  activeTab: "companies" | "jobs"
  onTabChange: (tab: "companies" | "jobs") => void
}

export function CompanyTabs({
  activeTab,
  onTabChange,
}: CompanyTabsProps) {
  // Helper para classes condicionais
  const getButtonClass = (isActive: boolean) =>
    `px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
      isActive
        ? "bg-blue-500 text-white shadow-lg"
        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
    }`

  return (
    <section className="sticky top-0 z-40 border-gray-800/50 border-b bg-gray-900/50 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-4">
          <div className="flex rounded-lg bg-gray-800/50 p-1">
            <button
              className={getButtonClass(activeTab === "jobs")}
              onClick={() => onTabChange("jobs")}
              type="button"
            >
              <Briefcase className="h-5 w-5" />
              <span>Projetos</span>
            </button>

            <button
              className={getButtonClass(activeTab === "companies")}
              onClick={() => onTabChange("companies")}
              type="button"
            >
              <Building2 className="h-5 w-5" />
              <span>Empresas</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
