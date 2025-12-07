import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

interface User {
  // Campos comuns
  nome: string
  email: string

  // Campos específicos
  cpf?: string
  cnpj?: string
  id?: number // ID do admin
}

// Adicionado 'admin'
export type UserType = "student" | "company" | "admin"

interface AuthContextType {
  user: User | null
  userType: UserType | null
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
    localStorage.clear()
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
