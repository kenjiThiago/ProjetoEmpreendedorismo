import { motion } from "framer-motion"
import { Briefcase, GraduationCap, Shield } from "lucide-react"
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
  const [userType, setUserType] = useState<UserType>("student")

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
          {/* Tabs (Só mostra se não for Admin, ou mostra Admin como opção escondida?) 
              Vou esconder a tab de admin e deixar só Student/Company aqui em cima */}
          {userType !== "admin" && (
            <div className="mb-8 flex justify-center">
              <div className="relative flex rounded-xl border border-gray-800 bg-gray-900 p-1">
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
                  className={`relative z-10 flex w-40 items-center justify-center gap-2 py-3 font-medium text-sm transition-colors ${userType === "student" ? "text-white" : "text-gray-400"}`}
                  onClick={() => setUserType("student")}
                  type="button"
                >
                  <GraduationCap className="h-4 w-4" /> Estudante
                </button>

                <button
                  className={`relative z-10 flex w-40 items-center justify-center gap-2 py-3 font-medium text-sm transition-colors ${userType === "company" ? "text-white" : "text-gray-400"}`}
                  onClick={() => setUserType("company")}
                  type="button"
                >
                  <Briefcase className="h-4 w-4" /> Empresa
                </button>
              </div>
            </div>
          )}

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border bg-gray-900/50 p-8 shadow-2xl backdrop-blur-sm ${userType === "admin" ? "border-red-500/30" : "border-gray-700"}`}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <AuthForm mode={mode} plan={plan} userType={userType} />

            {userType !== "admin" && (
              <div className="mt-6 text-center">
                <button
                  className="text-purple-400 text-sm hover:text-purple-300 hover:underline"
                  onClick={toggleMode}
                  type="button"
                >
                  {mode === "login"
                    ? "Não tem conta? Criar conta"
                    : "Já tem conta? Fazer login"}
                </button>
              </div>
            )}

            {/* Link Secreto/Discreto para Admin */}
            <div className="mt-8 flex justify-center border-gray-800 border-t pt-6">
              {userType === "admin" ? (
                <button
                  className="flex items-center gap-1 text-gray-500 text-xs hover:text-white"
                  onClick={() => {
                    setUserType("student")
                    setMode("login")
                  }}
                  type="button"
                >
                  Voltar para login comum
                </button>
              ) : (
                <button
                  className="flex items-center gap-1 text-gray-600 text-xs transition-colors hover:text-gray-400"
                  onClick={() => {
                    setUserType("admin")
                    setMode("login")
                  }}
                  type="button"
                >
                  <Shield className="h-3 w-3" /> Acesso Administrativo
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
