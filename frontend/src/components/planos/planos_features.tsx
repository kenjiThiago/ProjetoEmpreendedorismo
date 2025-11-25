import { motion } from "framer-motion"
import {
  Award,
  Briefcase,
  DollarSign,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import type { ViewMode } from "@/pages/planos"

interface PlanosFeaturesProps {
  viewMode: ViewMode
}

export function PlanosFeatures({ viewMode }: PlanosFeaturesProps) {
  const isStudent = viewMode === "student"

  const studentFeatures = [
    {
      icon: Users,
      title: "Trabalho em Squads",
      description:
        "Você nunca trabalha sozinho. Integre times com Devs Front, Back e Designers.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Award,
      title: "Mentoria Inclusa",
      description:
        "Nossos Tech Leads revisam seu código e guiam as melhores práticas durante o projeto.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Briefcase,
      title: "Experiência Real",
      description:
        "Vivencie a rotina de uma agência de software real, usando metodologias ágeis (Scrum/Kanban).",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: DollarSign,
      title: "Remuneração Justa",
      description:
        "Receba por projeto entregue. O valor é definido antes do início do desenvolvimento.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Networking Poderoso",
      description:
        "Conecte-se com outros estudantes talentosos e empresas parceiras da plataforma.",
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: TrendingUp,
      title: "Portfólio Validado",
      description:
        "Projetos com selo de qualidade DevStart valem mais no seu currículo.",
      color: "from-indigo-500 to-purple-500",
    },
  ]

  const companyFeatures = [
    {
      icon: Target,
      title: "Squads sob Demanda",
      description:
        "Montamos o time ideal para o seu projeto em tempo recorde. Sem burocracia de contratação.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: ShieldCheck,
      title: "Gestão e QA Inclusos",
      description:
        "A DevStart gerencia o projeto e garante a qualidade da entrega. Você não precisa ser técnico.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Velocidade de Entrega",
      description:
        "Vários desenvolvedores focados no seu projeto garantem entregas mais rápidas que freelancers isolados.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: TrendingUp,
      title: "Custo-Benefício",
      description:
        "Qualidade de agência com custos otimizados, impulsionada por novos talentos.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      title: "Sem Vínculo Empregatício",
      description:
        "Contrate o projeto, não o funcionário. Zero encargos trabalhistas ou dor de cabeça com RH.",
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: Briefcase,
      title: "Tudo em um só lugar",
      description:
        "Do design à implementação, nós cuidamos de todo o ciclo de desenvolvimento.",
      color: "from-indigo-500 to-purple-500",
    },
  ]

  const features = isStudent ? studentFeatures : companyFeatures

  return (
    <section className="bg-gray-900/50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          key={viewMode}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 font-bold text-3xl text-white md:text-4xl">
            {isStudent ? (
              <>
                Sua carreira acelerada por{" "}
                <span className="gradient-text">projetos reais</span>
              </>
            ) : (
              <>
                Desenvolvimento ágil com{" "}
                <span className="gradient-text">Squads gerenciados</span>
              </>
            )}
          </h2>
          <p className="mx-auto max-w-3xl text-gray-400 text-xl">
            {isStudent
              ? "Não é apenas freela, é uma experiência completa de desenvolvimento de software em equipe."
              : "Foque no seu negócio enquanto nós cuidamos da tecnologia e da gestão do time."}
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 transition-all duration-300 hover:scale-105 hover:border-gray-600"
                initial={{ opacity: 0, y: 30 }}
                key={`${viewMode}-${index}`}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r ${feature.color}`}
                >
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 font-semibold text-white text-xl">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
