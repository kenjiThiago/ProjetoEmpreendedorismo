import { Briefcase, MapPin, Shield, Users } from "lucide-react"
import type { GetCompanyInfo } from "@/http/types/get_companies_info"

interface CompanyThumbnailProps {
  company: GetCompanyInfo
  index: number
  type?: "grid" | "list"
  className?: string
}

function CompanyThumbnail({
  company,
  index,
  type = "grid",
  className = "",
}: CompanyThumbnailProps) {
  const typeClass = {
    list: "w-16 h-16 flex-shrink-0",
    grid: "h-32 overflow-hidden mb-4",
  }

  const cardType = typeClass[type]

  // Função para obter gradiente baseado no ID da empresa
  const getCompanyGradient = (companyId: number) => {
    const gradients = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
      "from-teal-500 to-green-500",
      "from-rose-500 to-pink-500",
      "from-amber-500 to-orange-500",
      "from-sky-500 to-blue-500",
      "from-cyan-500 to-teal-500",
      "from-slate-500 to-gray-500",
      "from-violet-500 to-indigo-500",
      "from-emerald-500 to-cyan-500",
      "from-red-500 to-rose-500",
      "from-yellow-500 to-amber-500",
      "from-lime-500 to-green-500",
      "from-fuchsia-500 to-purple-500",
      "from-pink-500 to-rose-500",
      "from-indigo-500 to-blue-500",
      "from-emerald-500 to-lime-500",
    ]
    return gradients[companyId % gradients.length]
  }

  const getCompanyAcronym = (name: string): string => {
    if (!name) {
      return "U"
    }

    const words = name.trim().split(" ")

    const lastName = words.at(-1)

    if (lastName === undefined) {
      return words[0].slice(0, 2).toUpperCase()
    }

    return (words[0][0] + lastName[0]).toUpperCase()
  }

  return (
    <div
      className={`bg-linear-to-br ${getCompanyGradient(index)} relative flex items-center justify-center rounded-lg ${cardType} ${className}`}
    >
      <div className="font-bold text-2xl text-white opacity-90 transition-opacity group-hover:opacity-100">
        {getCompanyAcronym(company.nome)}
      </div>

      <div className="absolute inset-0 rounded-lg bg-black/20 transition-colors group-hover:bg-black/10" />
    </div>
  )
}

interface CompanyCardProps {
  company: GetCompanyInfo
  index: number
  viewMode: "grid" | "list"
}

export function CompanyCard({ company, viewMode, index }: CompanyCardProps) {
  const displayPorte = company.porte === "Grande" ? "Médio" : company.porte

  if (viewMode === "list") {
    return (
      <div className="card group hover:-translate-y-1 relative cursor-pointer overflow-hidden p-6 transition-transform duration-300">
        <div className="flex flex-col gap-6 lg:flex-row">
          <CompanyThumbnail company={company} index={index} type="list" />

          <div className="flex-1">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex items-center space-x-1 rounded border border-blue-500/30 bg-blue-500/20 px-2 py-1 font-semibold text-blue-400 text-xs">
                    <Shield className="h-3 w-3" />
                    <span>Parceira</span>
                  </span>
                  <span className="rounded border border-purple-500/30 bg-purple-500/20 px-2 py-1 font-semibold text-purple-400 text-xs">
                    {company.setor}
                  </span>
                </div>

                <h3 className="mb-2 font-bold text-white text-xl transition-colors group-hover:text-blue-300">
                  {company.nome}
                </h3>

                <p className="mb-3 line-clamp-2 text-gray-400">
                  {company.descricao || "Sem descrição disponível."}
                </p>

                <div className="mb-3 flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{company.localizacao}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    {/* Usando a variável segura aqui */}
                    <span>{displayPorte}</span>
                  </div>
                  {/* <div className="flex items-center"> */}
                  {/*   <Briefcase className="mr-1 h-4 w-4" /> */}
                  {/*   <span>{company.numero_vagas ?? 0} projetos</span> */}
                  {/* </div> */}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="btn-primary flex items-center space-x-1 px-4 py-2 text-sm"
                  type="button"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Ver Projetos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card group hover:-translate-y-2 relative flex h-full cursor-pointer flex-col overflow-hidden p-6 transition-transform duration-300">
      <CompanyThumbnail company={company} index={index} type="grid" />

      <div className="mb-3 flex items-center gap-2">
        <span className="flex items-center space-x-1 rounded border border-blue-500/30 bg-blue-500/20 px-2 py-1 font-semibold text-blue-400 text-xs">
          <Shield className="h-3 w-3" />
          <span>Parceira</span>
        </span>
        <span className="line-clamp-1 rounded border border-purple-500/30 bg-purple-500/20 px-2 py-1 font-semibold text-purple-400 text-xs">
          {company.setor}
        </span>
      </div>

      <h3 className="mb-2 line-clamp-1 font-bold text-white text-xl transition-colors group-hover:text-blue-300">
        {company.nome}
      </h3>

      <p className="mb-3 line-clamp-2 grow text-gray-400 text-sm">
        {company.descricao || "Sem descrição disponível."}
      </p>

      <div className="mt-8 mb-4 flex items-center justify-between text-gray-400 text-sm">
        {/* <div className="flex items-center"> */}
        {/*   <Briefcase className="mr-1 h-4 w-4" /> */}
        {/*   <span>{company.numero_vagas ?? 0} projetos</span> */}
        {/* </div> */}
        <div className="flex items-center">
          <MapPin className="mr-1 h-4 w-4" />
          <span className="max-w-[120px] truncate">{company.localizacao}</span>
        </div>
        <div className="flex items-center">
          <Users className="mr-1 h-4 w-4" />
          {/* Usando a variável segura aqui */}
          <span>{displayPorte}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="btn-primary flex flex-1 items-center justify-center space-x-1 py-2 text-sm"
          type="button"
        >
          <Briefcase className="h-4 w-4" />
          <span>Projetos</span>
        </button>
      </div>
    </div>
  )
}
