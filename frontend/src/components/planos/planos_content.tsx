import { motion } from "framer-motion"
import { Briefcase, Check, Code2, Crown, Rocket, Star, X } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { ViewMode } from "@/pages/planos"

interface PlanosContentProps {
  viewMode: ViewMode
}

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  id: string
  name: string
  description: string
  price: string
  originalPrice?: string
  period: string
  popular?: boolean
  features: PlanFeature[]
  buttonText: string
  buttonStyle: string
  icon: any
  highlight?: string
}

export function PlanosContent({ viewMode }: PlanosContentProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  )
  const navigate = useNavigate()

  const handlePlanoClick = (planoId: string) => {
    navigate(`/auth?mode=register&plan=${encodeURIComponent(planoId)}`)
  }

  const isStudent = viewMode === "student"

  // --- PLANOS ESTUDANTE (Foco em entrar no Squad) ---
  const studentPlans: Plan[] = [
    {
      id: "Grátis",
      name: "Dev Starter",
      description: "Para quem quer começar a ganhar experiência em equipe.",
      price: "R$ 0",
      period: "/sempre",
      features: [
        { text: "Candidatura a projetos básicos", included: true },
        { text: "Alocação em Squads multidisciplinares", included: true },
        { text: "Certificado de participação", included: true },
        { text: "Mentoria com Tech Leads", included: false },
        { text: "Prioridade na seleção dos times", included: false },
        { text: "Acesso a projetos de grande porte", included: false },
      ],
      buttonText: "Cadastre-se Grátis",
      buttonStyle:
        "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600",
      icon: Code2,
    },
    {
      id: "Pago",
      name: "Dev Pro",
      description: "Acelere sua carreira participando dos melhores projetos.",
      price: billingPeriod === "monthly" ? "R$ 14,90" : "R$ 149",
      originalPrice: billingPeriod === "yearly" ? "R$ 178,80" : undefined,
      period: billingPeriod === "monthly" ? "/mês" : "/ano",
      popular: true,
      highlight: billingPeriod === "yearly" ? "2 meses grátis" : undefined,
      features: [
        { text: "Candidatura a projetos básicos", included: true },
        { text: "Alocação em Squads multidisciplinares", included: true },
        { text: "Certificado de participação", included: true },
        { text: "Mentoria com Tech Leads", included: true },
        { text: "Prioridade na seleção dos times", included: true },
        { text: "Acesso a projetos de grande porte", included: true },
      ],
      buttonText: "Ser Pro",
      buttonStyle: "btn-primary",
      icon: Crown,
    },
  ]

  // --- PLANOS EMPRESA (Foco em contratar o projeto/squad) ---
  const companyPlans: Plan[] = [
    {
      id: "Empresa Standard",
      name: "Standard Project",
      description: "Ideal para MVPs, Landing Pages e pequenas automações.",
      price: "Sob Medida", // Preço varia por projeto
      period: "",
      features: [
        { text: "Squad dedicado (Devs + Designer)", included: true },
        { text: "Gestão de projeto pela DevStart", included: true },
        { text: "Garantia de entrega (QA)", included: true },
        { text: "Suporte Padrão", included: true },
        { text: "Tech Lead Sênior dedicado", included: false },
        { text: "Manutenção pós-entrega", included: false },
      ],
      buttonText: "Cotar Projeto",
      buttonStyle:
        "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600",
      icon: Briefcase,
    },
    {
      id: "Empresa Enterprise",
      name: "Enterprise Squad",
      description: "Para sistemas complexos e desenvolvimento contínuo.",
      price: "Sob Consulta",
      period: "",
      popular: true,
      features: [
        { text: "Squad dedicado (Devs + Designer)", included: true },
        { text: "Gestão de projeto pela DevStart", included: true },
        { text: "Garantia de entrega (QA)", included: true },
        { text: "Suporte Prioritário", included: true },
        { text: "Tech Lead Sênior dedicado", included: true },
        { text: "Manutenção pós-entrega inclusa", included: true },
      ],
      buttonText: "Falar com Consultor",
      buttonStyle: "btn-primary",
      icon: Rocket,
    },
  ]

  const activePlans = isStudent ? studentPlans : companyPlans

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="bg-gray-950 py-16" id="planos-content">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Billing Toggle (Apenas para estudantes, pois empresa é sob medida) */}
        {isStudent && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-1">
              <button
                className={`rounded-lg px-6 py-3 font-medium text-sm transition-all duration-200 ${
                  billingPeriod === "monthly"
                    ? "bg-purple-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setBillingPeriod("monthly")}
                type="button"
              >
                Mensal
              </button>
              <button
                className={`relative rounded-lg px-6 py-3 font-medium text-sm transition-all duration-200 ${
                  billingPeriod === "yearly"
                    ? "bg-purple-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setBillingPeriod("yearly")}
                type="button"
              >
                Anual
                <span className="-top-4 -right-4 absolute rounded-full bg-orange-500 px-2 py-1 text-white text-xs">
                  Economize
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Plans Grid */}
        <motion.div
          animate="visible"
          className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2"
          initial="hidden"
          key={viewMode}
          variants={containerVariants}
        >
          {activePlans.map((plan) => {
            const IconComponent = plan.icon
            return (
              <motion.div
                className={`relative rounded-2xl border p-8 transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? "border-purple-500 bg-linear-to-br from-gray-900 to-purple-950/20 shadow-2xl shadow-purple-500/20"
                    : "border-gray-700 bg-gray-900/50"
                }`}
                key={plan.id}
                variants={cardVariants}
              >
                {plan.popular && (
                  <div className="-top-4 -translate-x-1/2 absolute left-1/2 transform">
                    <div className="flex items-center space-x-2 rounded-full bg-linear-to-r from-purple-500 to-orange-500 px-6 py-2 font-semibold text-sm text-white">
                      <Star className="h-4 w-4 fill-current" />
                      <span>
                        {isStudent ? "Melhor Custo-Benefício" : "Mais Completo"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mb-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <div
                      className={`rounded-xl p-3 ${
                        plan.popular
                          ? "bg-linear-to-r from-purple-500 to-orange-500"
                          : "bg-gray-800"
                      }`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <h3 className="mb-2 font-bold text-2xl text-white">
                    {plan.name}
                  </h3>
                  <p className="mb-6 text-gray-400">{plan.description}</p>

                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="font-bold text-4xl text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>

                  {plan.originalPrice && (
                    <div className="mt-2 flex items-center justify-center space-x-2">
                      <span className="text-gray-500 text-lg line-through">
                        {plan.originalPrice}
                      </span>
                      {plan.highlight && (
                        <span className="rounded-full bg-green-500 px-2 py-1 text-sm text-white">
                          {plan.highlight}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-8 space-y-4">
                  {plan.features.map((feature, index) => (
                    <div className="flex items-start space-x-3" key={index}>
                      <div
                        className={`mt-0.5 rounded-full p-1 ${
                          feature.included
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {feature.included ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          feature.included ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full rounded-xl py-4 font-semibold text-lg transition-all duration-200 ${plan.buttonStyle}`}
                  onClick={() => handlePlanoClick(plan.id)}
                  type="button"
                >
                  <span>{plan.buttonText}</span>
                </button>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="mb-4 text-gray-400">
            {isStudent
              ? "💡 O plano 'Starter' é gratuito para começar a ganhar experiência."
              : "💡 Nossa equipe faz a gestão completa. Você só aprova as entregas."}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
