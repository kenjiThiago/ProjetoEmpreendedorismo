import { motion } from "framer-motion"
import { Briefcase, Crown, GraduationCap, Star } from "lucide-react"
import type { ViewMode } from "@/pages/planos"

interface PlanosHeroProps {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

export function PlanosHero({ viewMode, setViewMode }: PlanosHeroProps) {
  const isStudent = viewMode === "student"

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-gray-900 via-purple-950/20 to-gray-900 py-16">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 flex justify-center">
            <div className="relative flex rounded-xl border border-gray-800 bg-gray-900 p-1">
              <motion.div
                animate={{
                  x: isStudent ? 0 : "100%",
                }}
                className="absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-lg bg-gray-800 shadow-sm"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />

              <button
                className={`relative z-10 flex w-40 items-center justify-center gap-2 py-3 font-medium text-sm transition-colors ${
                  isStudent ? "text-white" : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setViewMode("student")}
                type="button"
              >
                <GraduationCap className="h-4 w-4" />
                Para Estudantes
              </button>

              <button
                className={`relative z-10 flex w-40 items-center justify-center gap-2 py-3 font-medium text-sm transition-colors ${
                  isStudent ? "text-gray-400 hover:text-gray-200" : "text-white"
                }`}
                onClick={() => setViewMode("company")}
                type="button"
              >
                <Briefcase className="h-4 w-4" />
                Para Empresas
              </button>
            </div>
          </div>

          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl bg-linear-to-r from-purple-500 to-orange-500 p-4">
              <Crown className="h-12 w-12 text-white" />
            </div>
          </div>

          <h1 className="mb-6 font-bold text-4xl text-white md:text-5xl">
            {isStudent ? (
              <>
                Entre para o <span className="gradient-text">Squad</span>
              </>
            ) : (
              <>
                Tenha seu <span className="gradient-text">Time Tech</span>
              </>
            )}
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-gray-400 text-xl">
            {isStudent
              ? "Participe de projetos reais trabalhando em equipe. Nós montamos o time, você ganha a experiência e é remunerado."
              : "Publique seu desafio e nós montamos e gerenciamos um Squad de alta performance para entregar sua solução."}
          </p>

          <div className="mb-8 flex items-center justify-center space-x-2">
            <div className="flex items-center space-x-1">
              {[...new Array(5)].map((_, i) => (
                <Star
                  className="h-4 w-4 fill-current text-yellow-400"
                  key={i}
                />
              ))}
            </div>
            <span className="text-gray-400">
              {isStudent
                ? "Centenas de projetos entregues em equipe"
                : "Soluções entregues com qualidade de agência"}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
