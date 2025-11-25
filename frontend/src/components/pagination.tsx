import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void // Callback em vez de Evento
  scrollTargetId?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  scrollTargetId = "company-content",
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const handlePageChange = (page: number) => {
    // 1. Avisa o componente pai (CompanyPage)
    onPageChange(page)

    // 2. Faz o Scroll Suave (UX)
    // O setTimeout é usado para garantir que o DOM atualize antes de rolar
    setTimeout(() => {
      const targetElement = document.getElementById(scrollTargetId)
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect()
        const offsetTop = window.pageYOffset + rect.top - 150 // 150px de "respiro" pro header

        window.scrollTo({
          top: Math.max(0, offsetTop),
          behavior: "smooth",
        })
      }
    }, 100)
  }

  // Cálculos de itens visíveis (texto "Mostrando 1 a 6")
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Lógica para mostrar apenas algumas páginas (ex: 1, 2, 3 ... 10)
  const getVisiblePages = () => {
    const pages: number[] = []
    const showPages = 5 // Quantos botões aparecem

    let start = Math.max(1, currentPage - Math.floor(showPages / 2))
    const end = Math.min(totalPages, start + showPages - 1)

    if (end === totalPages) {
      start = Math.max(1, end - showPages + 1)
    }

    // Garante que start nunca seja menor que 1
    start = Math.max(1, start)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row">
      <div className="text-gray-400 text-sm">
        Mostrando <span className="font-medium text-white">{startItem}</span> a{" "}
        <span className="font-medium text-white">{endItem}</span>
      </div>

      <div className="flex items-center space-x-2">
        <motion.button
          className={`rounded-lg p-2 transition-colors ${
            currentPage === 1
              ? "cursor-not-allowed text-gray-600"
              : "text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
          whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>

        {visiblePages.map((page) => (
          <motion.button
            className={`rounded-lg px-3 py-2 font-medium text-sm transition-colors ${
              currentPage === page
                ? "bg-purple-500 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
            key={page}
            onClick={() => handlePageChange(page)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {page}
          </motion.button>
        ))}

        <motion.button
          className={`rounded-lg p-2 transition-colors ${
            currentPage === totalPages
              ? "cursor-not-allowed text-gray-600"
              : "text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
          whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  )
}
