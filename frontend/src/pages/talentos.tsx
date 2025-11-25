import { motion } from "framer-motion"
import { Briefcase, Users } from "lucide-react"
import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Pagination } from "@/components/pagination"
import { TalentosHero } from "@/components/talentos/talentos_hero"
import { StudentCard } from "@/components/talentos/talestos_card"
import { useTalents } from "@/http/use_students_info"

export function TalentosPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading, isError } = useTalents()

  // Estados de filtro vêm da URL
  const filters = {
    search: searchParams.get("search") || "",
    page: Number(searchParams.get("page")) || 1,
  }

  const updateURL = (key: string, value: string | number) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set(key, String(value))
      } else {
        prev.delete(key)
      }

      if (key !== "page") {
        prev.set("page", "1")
      }
      return prev
    })
  }

  // Lógica de Filtragem no Frontend
  const filteredStudents = useMemo(() => {
    const students = data?.estudantes || []
    const search = filters.search.toLowerCase()

    if (!search) {
      return students
    }

    return students.filter((student) => {
      // Busca por Nome
      const matchesName = student.nome.toLowerCase().includes(search)

      // Busca por Habilidade (limpa a string antes de comparar)
      const matchesSkill = student.habilidades.some((skill) =>
        skill.toLowerCase().includes(search)
      )

      // Busca por Papel
      const matchesRole = student.papeis_projetos.some((role) =>
        role.toLowerCase().includes(search)
      )

      // Busca por Universidade
      const matchesUni = student.universidade.toLowerCase().includes(search)

      return matchesName || matchesSkill || matchesRole || matchesUni
    })
  }, [data, filters.search])

  // Paginação
  const itemsPerPage = 9 // Cards menores, cabem mais
  const totalItems = filteredStudents.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (filters.page - 1) * itemsPerPage
  const currentStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  // --- Render Content ---
  let content

  if (isLoading) {
    content = (
      <div className="flex justify-center py-32">
        <div className="animate-pulse text-lg text-white">
          Buscando talentos...
        </div>
      </div>
    )
  } else if (isError) {
    content = (
      <div className="flex justify-center py-32">
        <div className="text-red-400">Erro ao carregar banco de talentos.</div>
      </div>
    )
  } else if (totalItems === 0) {
    content = (
      <div className="py-20 text-center">
        <Users className="mx-auto mb-4 h-16 w-16 text-gray-700" />
        <h3 className="mb-2 font-semibold text-white text-xl">
          Nenhum talento encontrado
        </h3>
        <p className="text-gray-500">
          Tente buscar por outra habilidade ou termo.
        </p>
        <button
          className="mt-6 text-purple-400 hover:text-purple-300 hover:underline"
          onClick={() => updateURL("search", "")}
          type="button"
        >
          Limpar busca
        </button>
      </div>
    )
  } else {
    content = (
      <>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          key={filters.page} // Força animação ao mudar página
        >
          {currentStudents.map((student, index) => (
            <StudentCard
              index={index} // CPF é uma boa key
              key={student.cpf}
              student={student}
            />
          ))}
        </motion.div>

        <Pagination
          currentPage={filters.page}
          itemsPerPage={itemsPerPage}
          onPageChange={(p) => updateURL("page", p)}
          scrollTargetId="talentos-content"
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
        <TalentosHero
          onSearch={(v) => updateURL("search", v)}
          searchTerm={filters.search}
        />

        {/* Barra de Contagem/Filtro Simples */}
        <section className="sticky top-16 z-30 border-gray-800 border-b bg-gray-900/50 py-4 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Briefcase className="h-4 w-4" />
              <span className="text-sm">
                Mostrando <strong className="text-white">{totalItems}</strong>{" "}
                estudantes disponíveis
              </span>
            </div>

            {/* Espaço para filtros avançados futuros */}
            <div className="flex gap-2">{/* Selects poderiam vir aqui */}</div>
          </div>
        </section>

        <section className="py-12" id="talentos-content">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {content}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
