import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

// Interface unificada para o usuário (pode ter campos de aluno ou empresa)
interface User {
  // Campos comuns
  nome: string
  email: string

  // Campos de Estudante
  cpf?: string
  universidade?: string
  curso?: string

  // Campos de Empresa
  cnpj?: string
  setor?: string
  porte?: string
}

export type UserType = "student" | "company"

interface AuthContextType {
  user: User | null
  userType: UserType | null // Novo campo
  isAuthenticated: boolean
  login: (userData: User, token: string, type: UserType) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Recupera dados ao carregar a página
    const storedUser = localStorage.getItem("user_data")
    const storedType = localStorage.getItem("user_type") as UserType
    const token = localStorage.getItem("authToken")

    if (storedUser && token && storedType) {
      setUser(JSON.parse(storedUser))
      setUserType(storedType)
    }
    setLoading(false)
  }, [])

  const login = (userData: User, token: string, type: UserType) => {
    localStorage.setItem("user_data", JSON.stringify(userData))
    localStorage.setItem("user_type", type)
    localStorage.setItem("authToken", token)

    setUser(userData)
    setUserType(type)
  }

  const logout = () => {
    localStorage.removeItem("user_data")
    localStorage.removeItem("user_type")
    localStorage.removeItem("authToken")
    localStorage.removeItem("aluno") // Limpeza legado

    setUser(null)
    setUserType(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
