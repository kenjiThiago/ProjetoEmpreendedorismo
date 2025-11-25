import { motion } from "framer-motion"
import {
  Briefcase,
  Building2,
  Globe,
  MapPin,
  Plus,
  Sparkles,
} from "lucide-react"
import type { CompanyProfile } from "@/http/types/get_company_dashboard"

interface CompanyHeroProps {
  company: CompanyProfile
  onRequestProject: () => void // Callback adicionado
}

export function CompanyHero({ company, onRequestProject }: CompanyHeroProps) {
  return (
    <section className="relative overflow-hidden border-gray-800 border-b bg-linear-to-br from-gray-900 via-blue-950/20 to-gray-900 py-12">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-8 md:flex-row md:items-start"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {/* Avatar */}
          <div className="group relative shrink-0">
            <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 shadow-blue-500/20 shadow-lg transition-transform group-hover:scale-105">
              <Building2 className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Info Principal */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
              <h1 className="font-bold text-3xl text-white">{company.nome}</h1>
              {company.porte === "Grande" && (
                <Sparkles className="h-5 w-5 text-yellow-400" />
              )}
            </div>

            <p className="mb-6 line-clamp-2 max-w-2xl text-gray-400">
              {company.descricao ||
                "Acompanhe o progresso dos seus Squads e solicite novas demandas para a nossa rede de talentos."}
            </p>

            {/* Chips de Informação */}
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-gray-300 text-sm">
                <Globe className="h-4 w-4 text-blue-400" />
                <span>{company.setor}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-gray-300 text-sm">
                <Briefcase className="h-4 w-4 text-indigo-400" />
                <span>{company.porte}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-gray-300 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{company.localizacao}</span>
              </div>
            </div>
          </div>

          {/* Botão de Ação */}
          <div className="mt-4 md:mt-0">
            <button
              className="btn-primary flex items-center gap-2 px-6 py-3 shadow-blue-500/20 shadow-lg transition-transform active:scale-95"
              onClick={onRequestProject} // Conectando o evento
              type="button"
            >
              <Plus className="h-5 w-5" />
              <span>Solicitar Projeto</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
