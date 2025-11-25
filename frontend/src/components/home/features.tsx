import { motion, useInView } from "framer-motion"
import {
  Briefcase,
  Building,
  Heart,
  Rocket,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { HomeViewMode } from "@/pages/home"

interface StatsInfo {
  numStudents: number
  numProjects: number
  numCompanies: number
  viewMode: HomeViewMode
}

// ... (Counter mantido igual) ...
function Counter({
  number,
  suffix,
  duration = 2000,
}: {
  number: number
  suffix: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const countRef = useRef(null)
  const isCounterInView = useInView(countRef, { once: true })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!(isCounterInView && isClient)) {
      return
    }

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) {
        startTime = currentTime
      }
      const progress = Math.min((currentTime - startTime) / duration, 1)

      const easeOutQuart = 1 - (1 - progress) ** 4
      setCount(Math.floor(easeOutQuart * number))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isCounterInView, number, duration, isClient])

  return (
    <span ref={countRef}>
      {isClient ? count.toLocaleString() : "0"}
      {suffix}
    </span>
  )
}

export function Features({
  numStudents,
  numProjects,
  numCompanies,
  viewMode,
}: StatsInfo) {
  const ref = useRef(null)
  const isStudent = viewMode === "student"

  const stats = [
    {
      number: numStudents,
      suffix: "+",
      label: "Universitários Cadastrados",
      icon: Users,
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      number: numProjects,
      suffix: "+",
      label: "Projetos Entregues",
      icon: Rocket,
      gradient: "from-green-500 to-emerald-400",
    },
    {
      number: numCompanies,
      suffix: "+",
      label: "Empresas Atendidas",
      icon: Building,
      gradient: "from-yellow-500 to-orange-400",
    },
  ]

  // --- FEATURES ESTUDANTE ---
  const studentFeatures = [
    {
      icon: Users,
      title: "Trabalhe em Squads",
      description:
        "Você não trabalha sozinho. Integre times com Devs e Designers para entregar soluções completas.",
    },
    {
      icon: Briefcase,
      title: "Experiência Real",
      description:
        "Vivencie a rotina de uma agência de software, com metodologias ágeis e prazos reais.",
    },
    {
      icon: Heart,
      title: "Mentoria Inclusa",
      description:
        "Nossos Tech Leads revisam seu código e guiam o time durante todo o desenvolvimento.",
    },
  ]

  // --- FEATURES EMPRESA ---
  const companyFeatures = [
    {
      icon: Target,
      title: "Foco no Seu Negócio",
      description:
        "Nós cuidamos da montagem, gestão e entrega do projeto. Você foca no crescimento da sua empresa.",
    },
    {
      icon: TrendingUp,
      title: "Custo Otimizado",
      description:
        "Desenvolvimento de alta qualidade com custos acessíveis para PMEs, impulsionado por talentos universitários.",
    },
    {
      icon: ShieldCheck,
      title: "Qualidade Garantida",
      description:
        "Todo código passa por revisão de Tech Leads seniores antes de ser entregue a você.",
    },
  ]

  const currentFeatures = isStudent ? studentFeatures : companyFeatures

  return (
    <section
      className="relative overflow-hidden bg-linear-to-br from-gray-900 via-blue-950/20 to-gray-900 py-20"
      ref={ref}
    >
      {/* Simplified background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          key={viewMode} // Anima ao trocar de aba
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="mb-4 font-bold text-3xl text-white md:text-4xl">
            {isStudent ? (
              <>
                Impacto Real no{" "}
                <span className="gradient-text">Seu Currículo</span>
              </>
            ) : (
              <>
                Soluções Tecnológicas{" "}
                <span className="gradient-text">Sem Complicação</span>
              </>
            )}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400 text-xl">
            {isStudent
              ? "Junte-se a milhares de estudantes que estão acelerando suas carreiras em projetos práticos."
              : "Acelere sua transformação digital com squads ágeis e sob demanda."}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                className="group text-center transition-transform duration-300 hover:scale-105"
                key={index}
              >
                <div
                  className={`h-20 w-20 bg-linear-to-br ${stat.gradient} mx-auto mb-4 flex items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110`}
                >
                  <IconComponent className="h-10 w-10 text-white" />
                </div>

                <div className="mb-2 bg-linear-to-r from-white to-gray-300 bg-clip-text font-bold text-4xl text-transparent md:text-5xl">
                  <Counter number={stat.number} suffix={stat.suffix} />
                </div>

                <div className="text-gray-400 text-lg transition-colors group-hover:text-gray-300">
                  {stat.label}
                </div>

                {/* Decorative line */}
                <div
                  className={`h-1 w-12 bg-linear-to-r ${stat.gradient} mx-auto mt-4 rounded-full`}
                />
              </div>
            )
          })}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 30 }}
          key={`features-${viewMode}`} // Anima troca de cards
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {currentFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                className="glass group hover:-translate-y-1 cursor-pointer rounded-xl p-6 text-center transition-all duration-300 hover:scale-102"
                key={index}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-red-500 transition-transform duration-300 group-hover:scale-110">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>

                <h3 className="mb-2 font-semibold text-lg text-white transition-colors group-hover:text-orange-300">
                  {feature.title}
                </h3>

                <p className="text-gray-400 text-sm transition-colors group-hover:text-gray-300">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
