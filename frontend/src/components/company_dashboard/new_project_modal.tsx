import { AnimatePresence, motion } from "framer-motion"
import {
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  Layers,
  Loader,
  Monitor,
  Sparkles,
  X,
} from "lucide-react"
import { useState } from "react"
import type { ProjectComplexity } from "@/http/types/create_project"
import { useClassifyProject } from "@/http/use_classify_project"
import { useCreateProject } from "@/http/use_create_project"

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  companyName: string
}

export function NewProjectModal({
  isOpen,
  onClose,
  companyName,
}: NewProjectModalProps) {
  const { mutate: createProject, isPending: isCreating } = useCreateProject()
  const { mutate: classifyProject, isPending: isClassifying } =
    useClassifyProject()

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    complexidade: "BAIXA" as ProjectComplexity,
    modalidade: "",
    orcamento_total: "",
    orcamento_estudantes: "",
    data_inicio: "",
    prazo_entrega: "",
  })

  // Estados para controle da IA
  const [aiJustification, setAiJustification] = useState("")
  const [aiEstimatedDays, setAiEstimatedDays] = useState<number | null>(null)
  const [aiSuggestedComplexity, setAiSuggestedComplexity] =
    useState<ProjectComplexity | null>(null)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Função auxiliar para somar dias a uma data
  const addDaysToDate = (dateString: string, days: number) => {
    if (!dateString) {
      return ""
    }
    const date = new Date(dateString)
    date.setDate(date.getDate() + days + 1) // +1 para evitar fuso horário cortando o dia
    return date.toISOString().split("T")[0]
  }

  // Manipula a mudança da Data de Início para recalcular o prazo automaticamente
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value
    let newDeadline = formData.prazo_entrega

    // Se a IA já estimou dias, recalculamos o prazo baseados na nova data de início
    if (aiEstimatedDays && newStartDate) {
      newDeadline = addDaysToDate(newStartDate, aiEstimatedDays)
    }

    setFormData((prev) => ({
      ...prev,
      data_inicio: newStartDate,
      prazo_entrega: newDeadline,
    }))
  }

  const handleAIAnalysis = () => {
    if (formData.titulo.length < 5 || formData.descricao.length < 10) {
      alert("Preencha o título e uma descrição detalhada para a IA analisar.")
      return
    }

    classifyProject(
      { titulo: formData.titulo, descricao: formData.descricao },
      {
        onSuccess: (data: any) => {
          // Define data de início como HOJE se estiver vazia
          const today = new Date().toISOString().split("T")[0]
          const startDate = formData.data_inicio || today

          // Calcula o prazo
          let deadline = formData.prazo_entrega
          if (data.estimativa_dias) {
            deadline = addDaysToDate(startDate, data.estimativa_dias)
            setAiEstimatedDays(data.estimativa_dias) // Salva a estimativa
          }

          const suggestedComplexity = data.complexidade as ProjectComplexity

          setFormData((prev) => ({
            ...prev,
            complexidade: suggestedComplexity,
            modalidade: data.modalidade_sugerida || prev.modalidade,
            data_inicio: startDate,
            prazo_entrega: deadline,
          }))

          setAiJustification(data.justificativa)
          setAiSuggestedComplexity(suggestedComplexity)
        },
        onError: () => {
          alert("Erro ao consultar a IA. Tente preencher manualmente.")
        },
      }
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createProject(
      {
        empresa_nome: companyName,
        titulo: formData.titulo,
        descricao: formData.descricao,
        complexidade: formData.complexidade,
        modalidade: formData.modalidade,
        orcamento_total: Number(formData.orcamento_total),
        orcamento_estudantes: Number(formData.orcamento_estudantes),
        data_inicio: formData.data_inicio,
        prazo_entrega: formData.prazo_entrega,
      },
      {
        onSuccess: () => {
          onClose()
          // Resetar estados
          setAiJustification("")
          setAiEstimatedDays(null)
          setAiSuggestedComplexity(null)
          setFormData({
            titulo: "",
            descricao: "",
            complexidade: "BAIXA",
            modalidade: "",
            orcamento_total: "",
            orcamento_estudantes: "",
            data_inicio: "",
            prazo_entrega: "",
          })
        },
      }
    )
  }

  // Verifica se o usuário "rebaixou" a complexidade sugerida
  const showComplexityWarning =
    aiSuggestedComplexity &&
    aiSuggestedComplexity !== formData.complexidade &&
    (aiSuggestedComplexity === "ALTA" ||
      (aiSuggestedComplexity === "MEDIA" && formData.complexidade === "BAIXA"))

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="custom-scrollbar relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-2xl"
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-white"
              onClick={onClose}
              type="button"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Header com Título e Botão de IA */}
            <div className="mb-6 flex items-center justify-between pr-8">
              <h2 className="font-bold text-2xl text-white">
                Solicitar Novo Projeto
              </h2>

              <button
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-medium text-xs transition-all ${
                  isClassifying
                    ? "bg-gray-800 text-gray-400"
                    : "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                }`}
                disabled={isClassifying}
                onClick={handleAIAnalysis}
                type="button"
              >
                {isClassifying ? (
                  <>
                    <Loader className="h-3.5 w-3.5 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Preencher com IA
                  </>
                )}
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* 1. Informações Básicas */}
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-medium text-gray-300 text-sm">
                    Título do Projeto *
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="titulo"
                    onChange={handleChange}
                    placeholder="Ex: Desenvolvimento de App Delivery"
                    required
                    type="text"
                    value={formData.titulo}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-300 text-sm">
                    Descrição Detalhada *
                  </label>
                  <textarea
                    className="min-h-[120px] w-full rounded-xl border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    name="descricao"
                    onChange={handleChange}
                    placeholder="Descreva os objetivos, requisitos e tecnologias..."
                    required
                    value={formData.descricao}
                  />
                </div>
              </div>

              {/* 2. Cronograma Inteligente */}
              <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-4">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-200 text-sm">
                  <Clock className="h-4 w-4 text-blue-400" />
                  Cronograma Estimado
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-gray-400 text-xs">
                      Data de Início Ideal
                    </label>
                    <input
                      className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500"
                      name="data_inicio"
                      onChange={handleStartDateChange} // Handler especial aqui
                      type="date"
                      value={formData.data_inicio}
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center justify-between text-gray-400 text-xs">
                      Prazo de Entrega
                      {aiEstimatedDays && (
                        <span className="flex items-center gap-1 text-purple-400">
                          <Sparkles className="h-3 w-3" /> Sugestão IA: ~
                          {aiEstimatedDays} dias
                        </span>
                      )}
                    </label>
                    <input
                      className={`w-full rounded-xl border p-3 text-white outline-none focus:border-blue-500 ${
                        aiEstimatedDays
                          ? "border-purple-500/50 bg-purple-900/10"
                          : "border-gray-700 bg-gray-800"
                      }`}
                      name="prazo_entrega"
                      onChange={handleChange}
                      type="date"
                      value={formData.prazo_entrega}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Detalhes Técnicos */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 font-medium text-gray-300 text-sm">
                    <Layers className="h-4 w-4 text-blue-400" />
                    Complexidade
                    {aiJustification && (
                      <span className="ml-auto text-[10px] text-green-400">
                        Sugerido por IA
                      </span>
                    )}
                  </label>
                  <select
                    className={`w-full rounded-xl border p-3 text-white outline-none focus:border-blue-500 ${
                      aiJustification
                        ? "border-green-500/50 bg-green-900/10"
                        : "border-gray-700 bg-gray-800"
                    }`}
                    name="complexidade"
                    onChange={handleChange}
                    value={formData.complexidade}
                  >
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                  </select>

                  {/* ALERTA VISUAL DE COMPLEXIDADE */}
                  {showComplexityWarning && (
                    <motion.div
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-2 text-xs text-yellow-200"
                      initial={{ opacity: 0, height: 0 }}
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
                      <p>
                        Atenção: A IA classificou como{" "}
                        <strong>{aiSuggestedComplexity}</strong>. Reduzir a
                        complexidade pode limitar o escopo técnico do projeto.
                      </p>
                    </motion.div>
                  )}

                  {aiJustification && !showComplexityWarning && (
                    <p className="mt-2 border-green-500/50 border-l-2 pl-2 text-gray-400 text-xs italic">
                      "{aiJustification}"
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 font-medium text-gray-300 text-sm">
                    <Monitor className="h-4 w-4 text-blue-400" />
                    Modalidade (Stack)
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500"
                    name="modalidade"
                    onChange={handleChange}
                    placeholder="Ex: Web React, Mobile Flutter..."
                    type="text"
                    value={formData.modalidade}
                  />
                </div>
              </div>

              {/* 4. Investimento */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 font-medium text-gray-300 text-sm">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    Orçamento Total (R$)
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-green-500"
                    min="0"
                    name="orcamento_total"
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                    value={formData.orcamento_total}
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 font-medium text-gray-300 text-sm">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    Repasse aos Alunos (R$)
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-green-500"
                    min="0"
                    name="orcamento_estudantes"
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                    value={formData.orcamento_estudantes}
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="mt-8 flex gap-4 pt-4">
                <button
                  className="flex-1 rounded-xl bg-gray-800 py-3 font-semibold text-gray-300 transition-colors hover:bg-gray-700"
                  onClick={onClose}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className="flex flex-1 items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/20 hover:shadow-lg disabled:opacity-50"
                  disabled={isCreating}
                  type="submit"
                >
                  {isCreating ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5" /> Solicitar Projeto
                    </span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
