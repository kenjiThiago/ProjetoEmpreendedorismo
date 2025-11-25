import { AnimatePresence, motion } from "framer-motion"
import {
  Calendar,
  DollarSign,
  FileText,
  Layers,
  Loader,
  Monitor,
  X,
} from "lucide-react"
import { useState } from "react"
import type { ProjectComplexity } from "@/http/types/create_project"
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
  const { mutate: createProject, isPending } = useCreateProject()

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
          // Limpar form se necessário
        },
      }
    )
  }

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
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-2xl"
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

            <h2 className="mb-6 font-bold text-2xl text-white">
              Solicitar Novo Projeto
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Título */}
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

              {/* Descrição */}
              <div>
                <label className="mb-2 block font-medium text-gray-300 text-sm">
                  Descrição Detalhada *
                </label>
                <textarea
                  className="min-h-[100px] w-full rounded-xl border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  name="descricao"
                  onChange={handleChange}
                  placeholder="Descreva os objetivos, requisitos e tecnologias..."
                  required
                  value={formData.descricao}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Complexidade */}
                <div>
                  <label className="mb-2 flex items-center gap-2 font-medium text-gray-300 text-sm">
                    <Layers className="h-4 w-4 text-blue-400" />
                    Complexidade *
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500"
                    name="complexidade"
                    onChange={handleChange}
                    value={formData.complexidade}
                  >
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                  </select>
                </div>

                {/* Modalidade */}
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

                {/* Datas */}
                <div>
                  <label className="mb-2 flex items-center gap-2 font-medium text-gray-300 text-sm">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    Data de Início
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500"
                    name="data_inicio"
                    onChange={handleChange}
                    type="date"
                    value={formData.data_inicio}
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 font-medium text-gray-300 text-sm">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    Prazo de Entrega
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500"
                    name="prazo_entrega"
                    onChange={handleChange}
                    type="date"
                    value={formData.prazo_entrega}
                  />
                </div>

                {/* Orçamentos */}
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
                  className="flex-1 rounded-xl bg-gray-800 py-3 font-semibold text-gray-300 hover:bg-gray-700"
                  onClick={onClose}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className="flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5" /> Solicitar
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
