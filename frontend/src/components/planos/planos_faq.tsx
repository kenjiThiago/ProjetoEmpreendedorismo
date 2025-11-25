import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import type { ViewMode } from "@/pages/planos"

interface PlanosFAQProps {
  viewMode: ViewMode
}

interface FAQItem {
  question: string
  answer: string
}

export function PlanosFAQ({ viewMode }: PlanosFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const isStudent = viewMode === "student"

  const studentFaqs: FAQItem[] = [
    {
      question: "Como funciona a seleção para o Squad?",
      answer:
        "Você se candidata a um projeto e nossa IA, junto com Tech Leads, avalia seu perfil e testes técnicos para montar um time equilibrado.",
    },
    {
      question: "Terei ajuda durante o projeto?",
      answer:
        "Sim! Todo Squad tem supervisão de um Tech Lead sênior da DevStart que realiza code reviews e ajuda nas decisões arquiteturais.",
    },
    {
      question: "O que acontece se eu travar em uma tarefa?",
      answer:
        "O trabalho é em equipe. Você pode pedir ajuda aos colegas do Squad ou solicitar mentoria ao Tech Lead responsável.",
    },
    {
      question: "Como é feito o pagamento?",
      answer:
        "Ao final de cada sprint ou entrega aprovada, o valor é liberado na sua carteira digital dentro da plataforma.",
    },
  ]

  const companyFaqs: FAQItem[] = [
    {
      question: "Eu preciso gerenciar os estudantes?",
      answer:
        "Não. A DevStart aloca um Gerente de Projeto para ser seu ponto de contato único. Nós gerenciamos o time, você recebe a entrega.",
    },
    {
      question: "Qual a garantia de qualidade do código?",
      answer:
        "Todos os códigos passam por revisão rigorosa dos nossos Tech Leads Seniores e testes automatizados antes de serem entregues.",
    },
    {
      question: "E se o estudante abandonar o projeto?",
      answer:
        "Nós garantimos a reposição imediata sem custo adicional e sem impacto no prazo final. Esse é o benefício do nosso modelo gerenciado.",
    },
    {
      question: "Vocês emitem Nota Fiscal?",
      answer:
        "Sim, emitimos NF de prestação de serviços de desenvolvimento de software para sua empresa.",
    },
  ]

  const faqs = isStudent ? studentFaqs : companyFaqs

  return (
    <section className="bg-gray-950 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          key={viewMode}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 font-bold text-3xl text-white md:text-4xl">
            Perguntas <span className="gradient-text">Frequentes</span>
          </h2>
          <p className="text-gray-400 text-xl">
            {isStudent
              ? "Entenda como funciona o modelo de Squads para sua carreira"
              : "Tire suas dúvidas sobre como acelerar seus projetos conosco"}
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50"
              initial={{ opacity: 0, y: 20 }}
              key={`${viewMode}-${index}`}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <button
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-gray-700/30"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                type="button"
              >
                <span className="font-semibold text-lg text-white">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
