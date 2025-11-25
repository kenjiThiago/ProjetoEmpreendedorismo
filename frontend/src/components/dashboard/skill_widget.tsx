"use client"

import { motion } from "framer-motion"
import {
  Award,
  BarChart3,
  Brain,
  Cloud,
  Code,
  Cpu,
  Database,
  FileCode,
  Gamepad2,
  GitBranch,
  Globe,
  Lock,
  Monitor,
  Palette,
  Server,
  Shield,
  Smartphone,
  Star,
  Terminal,
  Zap,
} from "lucide-react"

interface SkillsWidgetProps {
  skills: string[]
}

export default function SkillsWidget({ skills }: SkillsWidgetProps) {
  // Função auxiliar para determinar a cor baseada no nível JÁ FORMATADO
  const getSkillColor = (level: string) => {
    if (level === "Avançado") {
      return "text-red-400 bg-red-500/10 border-red-500/20"
    }
    if (level === "Intermediário") {
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
    }
    // Default / Iniciante
    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
  }

  const getSkillIcon = (skill: string) => {
    const skillLower = skill.toLowerCase()

    // Linguagens de Programação
    if (
      skillLower.includes("javascript") ||
      skillLower.includes("typescript")
    ) {
      return Code
    }
    if (skillLower.includes("python")) {
      return FileCode
    }
    if (skillLower.includes("java") && !skillLower.includes("javascript")) {
      return Cpu
    }
    if (
      skillLower.includes("c++") ||
      skillLower.includes("c#") ||
      skillLower.includes("c ")
    ) {
      return Terminal
    }
    if (skillLower.includes("php")) {
      return Globe
    }
    if (skillLower.includes("go") || skillLower.includes("golang")) {
      return Zap
    }
    if (skillLower.includes("rust")) {
      return Shield
    }
    if (skillLower.includes("swift")) {
      return Smartphone
    }
    if (skillLower.includes("kotlin")) {
      return Smartphone
    }

    // Frameworks e Libraries
    if (
      skillLower.includes("react") ||
      skillLower.includes("vue") ||
      skillLower.includes("angular")
    ) {
      return Zap
    }
    if (skillLower.includes("node") || skillLower.includes("express")) {
      return Server
    }
    if (skillLower.includes("django") || skillLower.includes("flask")) {
      return Globe
    }
    if (skillLower.includes("spring")) {
      return Award
    }
    if (skillLower.includes("laravel")) {
      return Globe
    }

    // Banco de Dados
    if (
      skillLower.includes("sql") ||
      skillLower.includes("mysql") ||
      skillLower.includes("postgresql") ||
      skillLower.includes("mongodb") ||
      skillLower.includes("database") ||
      skillLower.includes("bd")
    ) {
      return Database
    }

    // Mobile
    if (
      skillLower.includes("android") ||
      skillLower.includes("ios") ||
      skillLower.includes("mobile") ||
      skillLower.includes("flutter") ||
      skillLower.includes("react native")
    ) {
      return Smartphone
    }

    // Frontend/Design
    if (
      skillLower.includes("css") ||
      skillLower.includes("html") ||
      skillLower.includes("sass") ||
      skillLower.includes("design") ||
      skillLower.includes("ui/ux") ||
      skillLower.includes("figma")
    ) {
      return Palette
    }

    // DevOps e Cloud
    if (
      skillLower.includes("docker") ||
      skillLower.includes("kubernetes") ||
      skillLower.includes("aws") ||
      skillLower.includes("azure") ||
      skillLower.includes("gcp") ||
      skillLower.includes("cloud")
    ) {
      return Cloud
    }
    if (
      skillLower.includes("git") ||
      skillLower.includes("github") ||
      skillLower.includes("gitlab")
    ) {
      return GitBranch
    }

    // Backend/Servidor
    if (
      skillLower.includes("backend") ||
      skillLower.includes("api") ||
      skillLower.includes("microservices")
    ) {
      return Award
    }

    // Segurança
    if (
      skillLower.includes("security") ||
      skillLower.includes("cybersecurity") ||
      skillLower.includes("auth")
    ) {
      return Lock
    }

    // Data Science/AI
    if (
      skillLower.includes("machine learning") ||
      skillLower.includes("ai") ||
      skillLower.includes("data science") ||
      skillLower.includes("tensorflow") ||
      skillLower.includes("pytorch")
    ) {
      return Brain
    }
    if (
      skillLower.includes("analytics") ||
      skillLower.includes("data") ||
      skillLower.includes("visualization")
    ) {
      return BarChart3
    }

    // Sistemas/Infraestrutura
    if (
      skillLower.includes("linux") ||
      skillLower.includes("unix") ||
      skillLower.includes("system")
    ) {
      return Terminal
    }
    if (skillLower.includes("web") || skillLower.includes("frontend")) {
      return Monitor
    }

    // Gaming
    if (
      skillLower.includes("game") ||
      skillLower.includes("unity") ||
      skillLower.includes("unreal")
    ) {
      return Gamepad2
    }

    // Default
    return Star
  }

  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-600/50">
      {skills.length > 0 ? (
        <div className="custom-scrollbar max-h-44 space-y-3 overflow-y-scroll">
          {skills.map((skill, index) => {
            // --- NOVA LÓGICA DE TRATAMENTO ---
            // 1. Separa por hífen ao invés de dois pontos
            const parts = skill.split("-")

            // 2. Garante que temos nome e nível, senão define padrão
            const skillName = parts[0]?.trim() || skill
            const rawLevel = parts[1]?.trim().toUpperCase() || "" // Pega "AVANCADO"

            // 3. Normaliza o texto para exibição
            let displayLevel = "Iniciante"
            if (rawLevel === "AVANCADO" || rawLevel === "AVANÇADO") {
              displayLevel = "Avançado"
            } else if (rawLevel === "INTERMEDIARIO" || rawLevel === "INTERMEDIÁRIO") {
              displayLevel = "Intermediário"
            }

            // 4. Pega ícone e cor usando os valores tratados
            const Icon = getSkillIcon(skillName)
            const colorClass = getSkillColor(displayLevel)

            return (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center justify-between rounded-lg border p-3 ${colorClass} transition-transform duration-200 hover:scale-100`}
                initial={{ opacity: 0, x: -20 }}
                key={index} // Use index ou skillName se for único
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <div>
                    <p className="font-medium text-white capitalize">
                      {skillName}
                    </p>
                    <p className="text-xs capitalize opacity-70">{displayLevel}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {/* As bolinhas agora usam o displayLevel corrigido */}
                  {Array.from({ length: 3 }, (_, i) => (
                    <div
                      className={`mx-0.5 h-2 w-2 rounded-full ${
                        (displayLevel === "Avançado" && i < 3) ||
                        (displayLevel === "Intermediário" && i < 2) ||
                        (displayLevel === "Iniciante" && i < 1)
                          ? "bg-current"
                          : "bg-gray-600"
                      }`}
                      key={i}
                    />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="py-8 text-center">
          <Award className="mx-auto mb-3 h-12 w-12 text-gray-600" />
          <p className="mb-2 text-gray-400">Nenhuma habilidade ainda</p>
          <p className="text-gray-500 text-sm">
            Complete cursos para ganhar habilidades
          </p>
        </div>
      )}
    </div>
  )
}
