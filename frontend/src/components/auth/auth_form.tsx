/** biome-ignore-all lint/style/useFilenamingConvention: Faz sentido para esse contexto */
import { motion } from "framer-motion"
import {
  AlertCircle,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Globe,
  GraduationCap,
  Hash,
  Loader,
  Lock,
  Mail,
  MapPin,
  Smartphone,
  User,
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { type UserType, useAuth } from "@/contexts/auth_context"

interface AuthFormProps {
  mode: "login" | "register"
  userType: UserType
  plan?: string
}

type PaymentMethod = "Pix" | "Débito" | "Crédito"

export function AuthForm({ mode, userType, plan = "Grátis" }: AuthFormProps) {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [birthDateError, setBirthDateError] = useState("")
  const [apiError, setApiError] = useState("")

  // Estado Unificado (Campos de Estudante + Empresa)
  const [formData, setFormData] = useState({
    // Comuns
    nome: "", // Nome Completo (Estudante) ou Nome da Empresa (Empresa)
    email: "",
    password: "",
    confirmPassword: "",

    // Estudante
    cpf: "",
    birthDate: "",
    universidade: "",
    curso: "",
    semestre: "",
    paymentMethod: "Pix" as PaymentMethod | "",

    // Empresa
    cnpj: "",
    localizacao: "",
    setor: "",
    descricao: "",
    porte: "Pequeno", // Default
  })

  const [passwordStrength, setPasswordStrength] = useState({
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
    hasMinLength: false,
  })

  // --- FORMATADORES ---
  const formatCPF = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")

  const formatCNPJ = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18)

  // --- HANDLERS ---
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === "cpf") {
      formattedValue = formatCPF(value)
    }
    if (name === "cnpj") {
      formattedValue = formatCNPJ(value)
    }
    if (name === "semestre") {
      formattedValue = value.replace(/\D/g, "")
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }))

    if (name === "password") {
      setPasswordStrength(validatePassword(value))
    }
    if (name === "birthDate") {
      setBirthDateError(validateBirthDate(value))
    }
    setApiError("")
  }

  const validatePassword = (password: string) => ({
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasMinLength: password.length >= 8,
  })

  const validateBirthDate = (dateString: string) => {
    if (!dateString) {
      return ""
    }
    const birth = new Date(dateString)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    if (
      today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
    ) {
      age -= 1
    }
    if (age < 13) {
      return "Idade mínima 13 anos"
    }
    if (age > 100) {
      return "Data inválida"
    }
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError("")

    // Validações de Registro
    if (mode === "register") {
      if (formData.password !== formData.confirmPassword) {
        setApiError("As senhas não coincidem!")
        return
      }
      // Validação de força de senha (opcional para empresa, mas recomendado)
      if (
        userType === "student" &&
        !Object.values(passwordStrength).every(Boolean)
      ) {
        setApiError("Senha muito fraca.")
        return
      }
      if (!showConfirmation) {
        setShowConfirmation(true)
        window.scrollTo({ top: 65, behavior: "smooth" })
        return
      }
    }

    setLoading(true)

    try {
      let url = ""
      let body = {}

      // Define a URL e o Corpo com base no Tipo e Modo
      if (mode === "login") {
        // Assumindo rotas de login separadas ou a mesma rota com type check no backend
        // Aqui vou usar rotas distintas por segurança e clareza
        url = `http://127.0.0.1:8000/login/${userType === "student" ? "estudante" : "empresa"}`
        body = { email: formData.email, password: formData.password }
      } else if (userType === "student") {
        url = "http://127.0.0.1:8000/estudantes/adicionar"
        body = {
          nome: formData.nome,
          email: formData.email,
          senha: formData.password, // Backend espera 'senha'
          cpf: formData.cpf,
          data_nascimento: formData.birthDate,
          universidade: formData.universidade,
          curso: formData.curso,
          semestre: Number(formData.semestre),
          plano: plan, // Apenas estudantes tem plano no momento
        }
      } else {
        url = "http://127.0.0.1:8000/empresas"
        body = {
          nome: formData.nome, // Nome da empresa (PK)
          cnpj: formData.cnpj,
          email: formData.email,
          senha: formData.password,
          localizacao: formData.localizacao,
          setor: formData.setor,
          descricao: formData.descricao,
          porte: formData.porte,
        }
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.mensagem || data.message || "Erro na requisição")
      }

      // Normaliza dados para o contexto
      const userPayload =
        userType === "student" ? data.estudante || data.aluno : data.empresa
      const token = data.token || "dummy-token"

      login(userPayload, token, userType)

      if (mode === "register") {
        // Redirecionamento diferenciado se necessário, por enquanto dashboard
        navigate("/dashboard?welcome=true")
      } else {
        navigate("/dashboard")
      }
    } catch (error: any) {
      setApiError(error.message)
      setShowConfirmation(false)
    } finally {
      setLoading(false)
    }
  }

  const paymentOptions = [
    {
      value: "Pix",
      label: "PIX",
      icon: Smartphone,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30",
    },
    {
      value: "Débito",
      label: "Débito",
      icon: CreditCard,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      value: "Crédito",
      label: "Crédito",
      icon: CreditCard,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30",
    },
  ] as const

  const shouldShowPayment =
    mode === "register" && userType === "student" && plan !== "Grátis"

  // --- RENDERIZAÇÃO DE CONFIRMAÇÃO ---
  if (showConfirmation) {
    return (
      <motion.div
        animate={{ opacity: 1 }}
        className="mx-auto w-full max-w-2xl space-y-6"
        initial={{ opacity: 0 }}
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <Check className="h-10 w-10 text-green-400" />
          </div>
          <h2 className="mb-2 font-bold text-3xl text-white">
            Confirme seus dados
          </h2>
          <p className="text-gray-400">
            Verifique se as informações de{" "}
            {userType === "student" ? "estudante" : "empresa"} estão corretas
          </p>
        </div>

        <div className="space-y-4 rounded-2xl bg-gray-800/50 p-8 text-white">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-gray-400 text-sm">Nome / Empresa</p>
              <p className="font-medium">{formData.nome}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="font-medium">{formData.email}</p>
            </div>
            {userType === "student" ? (
              <>
                <div>
                  <p className="text-gray-400 text-sm">CPF</p>
                  <p>{formData.cpf}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Curso</p>
                  <p>{formData.curso}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-gray-400 text-sm">CNPJ</p>
                  <p>{formData.cnpj}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Setor</p>
                  <p>{formData.setor}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            className="flex-1 rounded-xl bg-gray-700 py-4 font-semibold text-white hover:bg-gray-600"
            onClick={() => setShowConfirmation(false)}
            type="button"
          >
            Voltar
          </button>
          <button
            className="flex-1 rounded-xl bg-linear-to-r from-purple-500 to-orange-500 py-4 font-semibold text-white hover:from-purple-600 hover:to-orange-600"
            disabled={loading}
            onClick={handleSubmit}
            type="button"
          >
            {loading ? (
              <Loader className="mx-auto animate-spin" />
            ) : (
              "Confirmar"
            )}
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <motion.form
        animate={{ opacity: 1 }}
        className="space-y-6"
        initial={{ opacity: 0 }}
        onSubmit={handleSubmit}
      >
        <div className="mb-8 text-center">
          <h2 className="mb-2 font-bold text-3xl text-white">
            {mode === "login"
              ? `Área da ${userType === "student" ? "Carreira" : "Empresa"}`
              : `Cadastro de ${userType === "student" ? "Estudante" : "Empresa"}`}
          </h2>
          <p className="text-gray-400 text-lg">
            {mode === "login"
              ? "Bem-vindo de volta!"
              : "Preencha os dados abaixo"}
          </p>
        </div>

        {apiError && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">{apiError}</span>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* --- CAMPOS COMUNS --- */}

          {/* Nome (Condicional no Login) */}
          {(mode === "register" || userType === "company") &&
            mode === "register" && (
              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-gray-300 text-sm">
                  {userType === "student"
                    ? "Nome Completo *"
                    : "Nome da Empresa *"}
                </label>
                <div className="relative">
                  {userType === "student" ? (
                    <User className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
                  ) : (
                    <Building2 className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
                  )}
                  <input
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 py-4 pr-4 pl-10 text-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                    name="nome"
                    onChange={handleInputChange}
                    placeholder={
                      userType === "student"
                        ? "Seu nome"
                        : "Razão Social ou Nome Fantasia"
                    }
                    required
                    type="text"
                    value={formData.nome}
                  />
                </div>
              </div>
            )}

          {/* Email */}
          <div className={mode === "login" ? "md:col-span-2" : ""}>
            <label className="mb-2 block font-medium text-gray-300 text-sm">
              Email Corporativo / Pessoal *
            </label>
            <div className="relative">
              <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
              <input
                className="w-full rounded-xl border border-gray-600 bg-gray-800 py-4 pr-4 pl-10 text-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                name="email"
                onChange={handleInputChange}
                placeholder="email@exemplo.com"
                required
                type="email"
                value={formData.email}
              />
            </div>
          </div>

          {/* --- CAMPOS ESPECÍFICOS: ESTUDANTE --- */}
          {mode === "register" && userType === "student" && (
            <>
              <div>
                <label className="mb-2 block font-medium text-gray-300 text-sm">
                  CPF *
                </label>
                <div className="relative">
                  <CreditCard className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 py-4 pr-4 pl-10 text-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength={14}
                    name="cpf"
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    required
                    type="text"
                    value={formData.cpf}
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block font-medium text-gray-300 text-sm">
                  Nascimento *
                </label>
                <div className="relative">
                  <Calendar className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 py-4 pr-4 pl-10 text-lg text-white outline-none focus:ring-2 focus:ring-purple-500"
                    name="birthDate"
                    onChange={handleInputChange}
                    required
                    type="date"
                    value={formData.birthDate}
                  />
                </div>
                {birthDateError && (
                  <p className="mt-1 text-red-400 text-xs">{birthDateError}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-gray-300 text-sm">
                  Universidade *
                </label>
                <div className="relative">
                  <GraduationCap className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 py-4 pr-4 pl-10 text-lg text-white outline-none focus:ring-2 focus:ring-purple-500"
                    name="universidade"
                    onChange={handleInputChange}
                    placeholder="PUC, USP, etc."
                    required
                    type="text"
                    value={formData.universidade}
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block font-medium text-gray-300 text-sm">
                  Curso *
                </label>
                <div className="relative">
                  <BookOpen className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 py-4 pr-4 pl-10 text-lg text-white outline-none focus:ring-2 focus:ring-purple-500"
                    name="curso"
                    onChange={handleInputChange}
                    placeholder="Ciência da Computação"
                    required
                    type="text"
                    value={formData.curso}
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block font-medium text-gray-300 text-sm">
                  Semestre *
                </label>
                <div className="relative">
                  <Hash className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 py-4 pr-4 pl-10 text-lg text-white outline-none focus:ring-2 focus:ring-purple-500"
                    max="12"
                    min="1"
                    name="semestre"
                    onChange={handleInputChange}
                    required
                    type="number"
                    value={formData.semestre}
                  />
                </div>
              </div>
            </>
          )}

          {/* --- CAMPOS ESPECÍFICOS: EMPRESA --- */}
          {mode === "register" && userType === "company" && (
            <>
              <div>
                <label className="mb-2 block font-medium text-gray-300 text-sm">
                  CNPJ *
                </label>
                <div className="relative">
                  <FileText className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 py-4 pr-4 pl-10 text-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength={18}
                    name="cnpj"
                    onChange={handleInputChange}
                    placeholder="00.000.000/0000-00"
                    required
                    type="text"
                    value={formData.cnpj}
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block font-medium text-gray-300 text-sm">
                  Porte da Empresa *
                </label>
                <div className="relative">
                  <Briefcase className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
                  <select
                    className="w-full appearance-none rounded-xl border border-gray-600 bg-gray-800 py-4 pr-4 pl-10 text-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                    name="porte"
                    onChange={handleInputChange}
                    required
                    value={formData.porte}
                  >
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    {/* <option value="Grande">Grande</option> */}
                  </select>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-gray-300 text-sm">
                  Setor de Atuação *
                </label>
                <div className="relative">
                  <Globe className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 py-4 pr-4 pl-10 text-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                    name="setor"
                    onChange={handleInputChange}
                    placeholder="Ex: Tecnologia, Varejo, Saúde"
                    required
                    type="text"
                    value={formData.setor}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-gray-300 text-sm">
                  Localização (Sede) *
                </label>
                <div className="relative">
                  <MapPin className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 py-4 pr-4 pl-10 text-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                    name="localizacao"
                    onChange={handleInputChange}
                    placeholder="Cidade - Estado"
                    required
                    type="text"
                    value={formData.localizacao}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-gray-300 text-sm">
                  Descrição da Empresa
                </label>
                <textarea
                  className="min-h-[100px] w-full rounded-xl border border-gray-600 bg-gray-800 p-4 text-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
                  name="descricao"
                  onChange={handleInputChange}
                  placeholder="Fale um pouco sobre a empresa..."
                  value={formData.descricao}
                />
              </div>
            </>
          )}
        </div>

        {/* Senha e Confirmação (Sempre visíveis no registro) */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className={mode === "login" ? "md:col-span-2" : ""}>
            <label className="mb-2 block font-medium text-gray-300 text-sm">
              Senha *
            </label>
            <div className="relative">
              <Lock className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
              <input
                className="w-full rounded-xl border border-gray-600 bg-gray-800 py-4 pr-12 pl-10 text-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
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

          {mode === "register" && (
            <div>
              <label className="mb-2 block font-medium text-gray-300 text-sm">
                Confirmar Senha *
              </label>
              <div className="relative">
                <Lock className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
                <input
                  className={`w-full rounded-xl border bg-gray-800 py-4 pr-10 pl-10 text-lg text-white outline-none focus:ring-2 focus:ring-purple-500 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? "border-red-500" : "border-gray-600"}`}
                  name="confirmPassword"
                  onChange={handleInputChange}
                  placeholder="********"
                  required
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                />
              </div>
            </div>
          )}
        </div>

        {/* Checkbox Termos */}
        {mode === "register" && (
          <div className="flex items-start space-x-3 rounded-xl bg-gray-800/30 p-4">
            <input
              className="mt-0.5 h-5 w-5 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500"
              id="terms"
              required
              type="checkbox"
            />
            <label
              className="text-gray-300 text-sm leading-relaxed"
              htmlFor="terms"
            >
              Aceito os{" "}
              <a
                className="text-purple-400 underline hover:text-purple-300"
                href="#"
              >
                termos de uso
              </a>{" "}
              e a{" "}
              <a
                className="text-purple-400 underline hover:text-purple-300"
                href="#"
              >
                política de privacidade
              </a>
            </label>
          </div>
        )}

        {/* Pagamento (Só para Estudante) */}
        {shouldShowPayment && (
          <div className="space-y-4">
            <label className="mb-2 block font-medium text-gray-300 text-sm">
              Forma de pagamento *
            </label>
            <div className="grid gap-4 md:grid-cols-3">
              {paymentOptions.map((option) => {
                const Icon = option.icon
                const isSelected = formData.paymentMethod === option.value
                return (
                  <button
                    className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 hover:scale-102 ${isSelected ? `${option.borderColor} ${option.bgColor}` : "border-gray-600 bg-gray-800/30 hover:bg-gray-800/50"}`}
                    key={option.value}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentMethod: option.value,
                      }))
                    }
                    type="button"
                  >
                    <Icon
                      className={`h-6 w-6 ${isSelected ? option.color : "text-gray-400"}`}
                    />
                    <span
                      className={`font-medium text-xs ${isSelected ? "text-white" : "text-gray-300"}`}
                    >
                      {option.label}
                    </span>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <Check className={`h-4 w-4 ${option.color}`} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <button
          className="w-full rounded-xl bg-linear-to-r from-purple-500 to-orange-500 py-4 font-bold text-lg text-white shadow-lg transition-all hover:scale-[1.01] hover:from-purple-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <Loader className="mx-auto animate-spin" />
          ) : mode === "login" ? (
            "Entrar"
          ) : (
            "Continuar"
          )}
        </button>
      </motion.form>
    </div>
  )
}
