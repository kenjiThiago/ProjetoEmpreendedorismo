import { AnimatePresence, motion } from "framer-motion"
import { Search, Sparkles, X } from "lucide-react"

interface TalentosHeroProps {
  searchTerm: string
  onSearch: (term: string) => void
}

export function TalentosHero({ searchTerm, onSearch }: TalentosHeroProps) {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-gray-900 via-purple-950/20 to-gray-900 py-16">
      {/* Background Decorativo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl bg-linear-to-r from-purple-500 to-indigo-500 p-4">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>

          <h1 className="mb-6 font-bold text-4xl text-white md:text-5xl">
            Quem constrói seus{" "}
            <span className="bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Projetos
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-gray-400 text-xl">
            Nossa base conta com estudantes das melhores universidades.
            É com esses talentos que montamos os Squads de alta performance para
            sua empresa.
          </p>

          {/* Barra de Busca */}
          <div className="relative mx-auto max-w-2xl">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-4 h-5 w-5 text-gray-400" />
              <input
                className="w-full rounded-xl border border-gray-700 bg-gray-800/50 py-4 pr-12 pl-12 text-lg text-white placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Explore por habilidade (ex: React, Python) ou universidade..."
                type="text"
                value={searchTerm}
              />

              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    animate={{ opacity: 1 }}
                    className="absolute right-4 flex h-5 w-5 items-center justify-center text-gray-400 transition-colors hover:text-white"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    onClick={() => onSearch("")}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
