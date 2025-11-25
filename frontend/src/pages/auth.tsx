import { motion } from "framer-motion"
import { Briefcase, GraduationCap } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { AuthForm } from "@/components/auth/auth_form"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import type { UserType } from "@/contexts/auth_context"

export function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const plan = searchParams.get("plan") || "Grátis"
  const modeFromUrl = searchParams.get("mode")

  const [mode, setMode] = useState<"login" | "register">("register")
  const [userType, setUserType] = useState<UserType>("student") // Estado para o tipo de usuário

  // Sincroniza estado local com URL ao carregar
  useEffect(() => {
    if (modeFromUrl === "login" || modeFromUrl === "register") {
      setMode(modeFromUrl)
    }
  }, [modeFromUrl])

  const toggleMode = () => {
    const newMode = mode === "login" ? "register" : "login"
    setMode(newMode)
    setSearchParams((prev) => {
      prev.set("mode", newMode)
      return prev
    })
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          {/* Seletor de Tipo de Usuário (Tabs) */}
          <div className="mb-8 flex justify-center">
            <div className="relative flex rounded-xl border border-gray-800 bg-gray-900 p-1">
              {/* Background Animado da Aba */}
              <motion.div
                animate={{
                  x: userType === "student" ? 0 : "100%",
                }}
                className="absolute h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-lg bg-gray-800 shadow-sm"
                initial={false}
                style={{ top: 4, left: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />

              <button
                className={`relative z-10 flex w-40 items-center justify-center gap-2 py-3 font-medium text-sm transition-colors ${
                  userType === "student"
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setUserType("student")}
                type="button"
              >
                <GraduationCap className="h-4 w-4" />
                Estudante
              </button>

              <button
                className={`relative z-10 flex w-40 items-center justify-center gap-2 py-3 font-medium text-sm transition-colors ${
                  userType === "company"
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setUserType("company")}
                type="button"
              >
                <Briefcase className="h-4 w-4" />
                Empresa
              </button>
            </div>
          </div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-700 bg-gray-900/50 p-8 shadow-2xl backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            {/* Passamos o userType para o formulário saber quais campos mostrar */}
            <AuthForm mode={mode} plan={plan} userType={userType} />

            <div className="mt-6 text-center">
              <button
                className="text-purple-400 text-sm transition-colors duration-200 hover:text-purple-300 hover:underline"
                onClick={toggleMode}
                type="button"
              >
                {mode === "login"
                  ? "Não tem conta? Criar conta"
                  : "Já tem conta? Fazer login"}
              </button>
            </div>

            {/* Indicadores Visuais */}
            <div className="mt-6 flex justify-center gap-2">
              <div
                className={`h-1.5 w-8 rounded-full transition-colors ${mode === "register" ? "bg-purple-500" : "bg-gray-700"}`}
              />
              <div
                className={`h-1.5 w-8 rounded-full transition-colors ${mode === "login" ? "bg-purple-500" : "bg-gray-700"}`}
              />
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
