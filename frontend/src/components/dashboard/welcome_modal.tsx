import { AnimatePresence, motion } from "framer-motion"
import { Award, Briefcase, DollarSign, Trophy, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

export function WelcomeModal() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (searchParams.get("welcome") === "true") {
      setIsOpen(true)
    }
  }, [searchParams])

  const handleClose = () => {
    setIsOpen(false)

    setSearchParams(
      (prev) => {
        prev.delete("welcome")
        return prev
      },
      { replace: true }
    )
  }

  const handleAction = () => {
    navigate("/empresas")
  }

  // Benefícios mantidos
  const benefits = [
    {
      icon: Briefcase,
      title: "Encontre Projetos Reais",
      description: "Conecte-se com PMEs e ganhe experiência",
    },
    {
      icon: Award,
      title: "Construa seu Portfólio",
      description: "Cada projeto concluído fortalece seu perfil",
    },
    {
      icon: DollarSign,
      title: "Ganhe Renda Extra",
      description: "Seja pago para colocar suas skills em prática",
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-8"
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-white"
              onClick={handleClose}
              type="button"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/20 shadow-lg">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h2 className="mb-2 font-bold text-2xl text-white">
                🎉 Bem-vindo ao DevStart!
              </h2>
              <p className="text-gray-400">
                Sua conta gratuita foi criada com sucesso.
              </p>
            </div>

            <div className="mb-6 space-y-4">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon
                return (
                  <div
                    className="flex items-center space-x-3 rounded-lg border border-gray-700/50 bg-gray-800/50 p-3"
                    key={index}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
                      <IconComponent className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-white">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-3">
              <button
                className="btn-primary w-full py-3 font-semibold shadow-blue-500/20 shadow-lg"
                onClick={handleAction}
                type="button"
              >
                Encontrar Meu Primeiro Projeto
              </button>
              <button
                className="btn-secondary w-full py-3 text-gray-300 hover:text-white"
                onClick={handleClose}
                type="button"
              >
                Explorar Dashboard
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
