import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail,
  Shield,
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { type UserType, useAuth } from "@/contexts/auth_context"

interface AuthFormProps {
  mode: "login" | "register"
  userType: UserType
  plan?: string
}

export function AuthForm({ mode, userType, plan = "Grátis" }: AuthFormProps) {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState("")

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    birthDate: "",
    universidade: "",
    curso: "",
    semestre: "",
    cnpj: "",
    localizacao: "",
    setor: "",
    descricao: "",
    porte: "Pequeno",
  })

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setApiError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError("")
    setLoading(true)

    try {
      let url = ""
      let body = {}

      // --- LÓGICA DE ROTEAMENTO DE LOGIN ---
      if (mode === "login") {
        const endpointMap = {
          student: "estudante",
          company: "empresa",
          admin: "admin",
        }
        url = `http://127.0.0.1:8000/login/${endpointMap[userType]}`
        body = { email: formData.email, password: formData.password }
      } else {
        // REGISTER (Apenas Student e Company)
        if (userType === "student") {
          url = "http://127.0.0.1:8000/alunos"
          body = {
            /* ... campos do estudante ... */
            nome: formData.nome,
            email: formData.email,
            senha: formData.password,
            cpf: formData.cpf,
            data_nascimento: formData.birthDate,
            universidade: formData.universidade,
            curso: formData.curso,
            semestre: Number(formData.semestre),
            plano: plan,
          }
        } else if (userType === "company") {
          url = "http://127.0.0.1:8000/empresas"
          body = {
            /* ... campos da empresa ... */
            nome: formData.nome,
            cnpj: formData.cnpj,
            email: formData.email,
            senha: formData.password,
            localizacao: formData.localizacao,
            setor: formData.setor,
            descricao: formData.descricao,
            porte: formData.porte,
          }
        }
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.mensagem || data.erro || "Erro na requisição")
      }

      // Normaliza dados para o contexto
      const userPayload = data.estudante || data.empresa || data.admin
      const token = data.token || "dummy-token"

      login(userPayload, token, userType)

      // Redirecionamento baseado no tipo
      if (userType === "admin") {
        navigate("/admin")
      } else if (mode === "register") {
        navigate("/dashboard?welcome=true")
      } else {
        navigate("/dashboard")
      }
    } catch (error: any) {
      setApiError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Header Especial para Admin */}
      {userType === "admin" && (
        <div className="mb-6 flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-red-400">
          <Shield className="h-5 w-5" />
          <span className="font-bold text-sm">
            Área Restrita: Acesso Administrativo
          </span>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {apiError && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Inputs Comuns de Login */}
        <div className="space-y-4">
          <div>
            <label className="mb-2 block font-medium text-gray-300 text-sm">
              Email
            </label>
            <div className="relative">
              <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
              <input
                className="w-full rounded-xl border border-gray-600 bg-gray-800 py-4 pr-4 pl-10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                name="email"
                onChange={handleInputChange}
                placeholder={
                  userType === "admin"
                    ? "admin@devstart.com"
                    : "email@exemplo.com"
                }
                required
                type="email"
                value={formData.email}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-300 text-sm">
              Senha
            </label>
            <div className="relative">
              <Lock className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
              <input
                className="w-full rounded-xl border border-gray-600 bg-gray-800 py-4 pr-12 pl-10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                name="password"
                onChange={handleInputChange}
                placeholder="********"
                required
                type={showPassword ? "text" : "password"}
                value={formData.password}
              />
              <button
                className="-translate-y-1/2 absolute top-1/2 right-3 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Inputs de Cadastro omitidos por brevidade, mantenha os originais dentro de 
            if (mode === 'register' && userType !== 'admin') ... */}

        <button
          className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-orange-500 py-4 font-bold text-lg text-white shadow-lg hover:scale-[1.01] disabled:opacity-50"
          disabled={loading}
          type="submit"
        >
          {loading ? <Loader className="mx-auto animate-spin" /> : "Acessar"}
        </button>
      </form>
    </div>
  )
}
