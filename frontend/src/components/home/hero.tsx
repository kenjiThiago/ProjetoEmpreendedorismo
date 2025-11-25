import { motion } from "framer-motion"
import {
  Briefcase,
  Building2,
  Code2,
  GraduationCap,
  Search,
  Star,
  UserPlus,
  Zap,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { HomeViewMode } from "@/pages/home"

interface HeroInfo {
  numStudents: number | undefined
  viewMode: HomeViewMode
  setViewMode: (mode: HomeViewMode) => void
}

export function Hero({ numStudents, viewMode, setViewMode }: HeroInfo) {
  const [isClient, setIsClient] = useState(false)
  const navigate = useNavigate()
  const isStudent = viewMode === "student"

  const codeElements = [
    "<>",
    "{}",
    "( )",
    "[ ]",
    "</ >",
    "fn()",
    "=>",
    "&&",
    "||",
    "??",
    "...",
    "::",
    "$",
  ]

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-950">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-gray-950 via-blue-950/20 to-gray-950" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-red-500/5 blur-3xl" />
        {isClient && (
          <div className="absolute inset-0 opacity-40">
            {codeElements.map((code, i) => (
              <motion.div
                animate={{ y: [0, -10, 0], opacity: [0.2, 0.5, 0.2] }}
                className="absolute font-bold font-mono text-lg text-orange-400 opacity-30"
                key={i}
                style={{
                  left: `${(i * 23 + Math.random() * 15) % 100}%`,
                  top: `${(i * 17 + Math.random() * 20) % 100}%`,
                }}
                transition={{
                  duration: 3 + i * 0.2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              >
                {code}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            {/* --- TOGGLE SWITCH --- */}
            <div className="mb-8 flex justify-center lg:justify-start">
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
                  className={`relative z-10 flex w-40 items-center justify-center gap-2 py-2 font-medium text-sm transition-colors ${
                    isStudent
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  onClick={() => setViewMode("student")}
                  type="button"
                >
                  <GraduationCap className="h-4 w-4" />
                  Para Estudantes
                </button>

                <button
                  className={`relative z-10 flex w-40 items-center justify-center gap-2 py-2 font-medium text-sm transition-colors ${
                    isStudent
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-white"
                  }`}
                  onClick={() => setViewMode("company")}
                  type="button"
                >
                  <Building2 className="h-4 w-4" />
                  Para Empresas
                </button>
              </div>
            </div>

            {/* Rating Section */}
            <div className="mb-6 flex items-center justify-center space-x-2 lg:justify-start">
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
                  ? `Plataforma de ${numStudents}+ estudantes de TI`
                  : "Solução ágil para PMEs inovadoras"}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="mb-6 text-center font-bold text-4xl text-white leading-tight md:text-5xl lg:text-left lg:text-6xl">
              <div className="flex flex-col gap-2 lg:block">
                {isStudent ? (
                  <>
                    Sua primeira experiência em
                    <span className="gradient-text block pb-2">
                      Squads Reais.
                    </span>
                  </>
                ) : (
                  <>
                    Tire seu projeto do papel com
                    <span className="gradient-text block pb-2">
                      Squads sob Demanda.
                    </span>
                  </>
                )}
              </div>
            </h1>

            {/* Description */}
            <p className="mb-8 text-center text-gray-300 text-xl leading-relaxed lg:text-left">
              {isStudent ? (
                <>
                  A Dev Start é a sua agência de talentos{" "}
                  <span className="font-semibold text-green-400">
                    100% gratuita
                  </span>
                  . Entre para um time, receba mentoria e entregue
                  <span className="font-semibold text-orange-400">
                    {" "}
                    projetos remunerados
                  </span>{" "}
                  para o mercado.
                </>
              ) : (
                <>
                  Conectamos sua empresa a times de estudantes de alta
                  performance,{" "}
                  <span className="font-semibold text-green-400">
                    gerenciados por nós
                  </span>
                  . Entregas rápidas,{" "}
                  <span className="font-semibold text-orange-400">
                    custo otimizado
                  </span>{" "}
                  e zero dor de cabeça com contratação.
                </>
              )}
            </p>

            {/* Buttons */}
            <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              {isStudent ? (
                <>
                  <motion.button
                    className="btn-primary flex items-center justify-center space-x-2 px-8 py-4 text-lg"
                    onClick={() => navigate("/empresas")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Zap className="h-5 w-5" />
                    <span>Ver Projetos</span>
                  </motion.button>

                  <motion.button
                    className="flex items-center justify-center space-x-2 rounded-lg border-2 border-orange-400 bg-transparent px-8 py-4 font-semibold text-lg text-orange-400 transition-colors hover:bg-orange-400/10"
                    onClick={() => navigate("/planos")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Cadastre-se Grátis</span>
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    className="btn-primary flex items-center justify-center space-x-2 px-8 py-4 text-lg"
                    onClick={() => navigate("/auth?mode=register")} // Ajuste para cadastro de empresa
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Briefcase className="h-5 w-5" />
                    <span>Solicitar Squad</span>
                  </motion.button>

                  <motion.button
                    className="flex items-center justify-center space-x-2 rounded-lg border-2 border-orange-400 bg-transparent px-8 py-4 font-semibold text-lg text-orange-400 transition-colors hover:bg-orange-400/10"
                    onClick={() => navigate("/talentos")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Search className="h-5 w-5" />
                    <span>Ver Talentos</span>
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>

          {/* Right Content - Code Editor */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full max-w-lg p-8 lg:p-0">
              {/* Main Card - Code Editor Mockup */}
              <div className="card transform bg-gray-900 p-1 shadow-2xl shadow-black/50 transition-transform duration-500 hover:rotate-2">
                {/* Editor Header */}
                <div className="flex items-center space-x-2 rounded-t-lg bg-gray-800 p-4">
                  <div className="flex space-x-2">
                    <div className="h-3.5 w-3.5 rounded-full bg-red-500" />
                    <div className="h-3.5 w-3.5 rounded-full bg-yellow-500" />
                    <div className="h-3.5 w-3.5 rounded-full bg-green-500" />
                  </div>
                  <div className="ml-4 font-mono text-gray-400 text-sm">
                    {isStudent ? "squad_setup.tsx" : "project_delivery.tsx"}
                  </div>
                </div>

                {/* Editor Content */}
                <div className="rounded-b-lg bg-gray-900 p-8 font-mono text-base leading-relaxed">
                  <div className="space-y-3">
                    <div className="text-purple-400">
                      const {isStudent ? "MySquad" : "ProjectSuccess"} = {"{"}
                    </div>
                    <div className="ml-6 text-blue-400">
                      {isStudent
                        ? 'role: "Backend Developer",'
                        : 'delivery: "On Time",'}
                    </div>
                    <div className="ml-6 text-yellow-400">
                      {isStudent
                        ? 'teammates: ["Frontend", "UX/UI"],'
                        : 'cost_saving: "40%",'}
                    </div>
                    <div className="ml-6 text-green-400">
                      {isStudent ? "mentorship: true," : "quality_check: true,"}
                    </div>
                    <div className="ml-6 text-orange-400">
                      {isStudent
                        ? 'status: "Hired 🚀"'
                        : 'status: "Deployed 🚀"'}
                    </div>
                    <div className="text-purple-400">{"}"};</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="lg:-top-6 lg:-right-6 absolute top-4 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg">
                <Zap className="h-7 w-7" />
              </div>

              <div className="lg:-bottom-6 lg:-left-6 absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/20 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 shadow-blue-500/50 shadow-lg">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
