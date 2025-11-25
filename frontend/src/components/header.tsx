import { AnimatePresence, motion } from "framer-motion"
import {
  BarChart3,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  X,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth_context"

// --- SUBCOMPONENTES (Mantidos iguais) ---

const NavigationLinks = ({
  pathname,
  onItemClick,
  isMobile = false,
  userType,
  isAuthenticated,
}: any) => {
  // Lógica de decisão dos links
  const items = useMemo(() => {
    const baseItems = [{ name: "Planos", href: "/planos" }]

    // Se for EMPRESA, vê Talentos
    if (isAuthenticated && userType === "company") {
      return [
        { name: "Banco de Talentos", href: "/talentos" }, // Nova Rota
        ...baseItems,
      ]
    }

    // Se for ESTUDANTE ou NÃO LOGADO, vê Projetos (Vitrine)
    return [{ name: "Projetos", href: "/empresas" }, ...baseItems]
  }, [userType, isAuthenticated])

  return (
    <>
      {items.map((item) => (
        <Link key={item.name} to={item.href}>
          <button
            className={`group relative cursor-pointer px-3 py-2 font-medium text-sm transition-colors duration-200 ${
              pathname === item.href
                ? "text-orange-400"
                : "text-gray-300 hover:text-orange-400"
            } ${isMobile ? "block w-full text-left text-base" : ""}`}
            onClick={onItemClick}
            type="button"
          >
            {item.name}
            {!isMobile && (
              <div
                className={`absolute bottom-0 left-0 h-0.5 w-full transform bg-linear-to-r from-orange-500 to-red-500 transition-transform duration-200 ${
                  pathname === item.href
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            )}
          </button>
        </Link>
      ))}
    </>
  )
}

const SearchInput = ({
  value,
  onChange,
  onSubmit,
  onFocus,
  onKeyDown,
  onClear,
  isMobile = false,
}: any) => (
  <form className="w-full" onSubmit={onSubmit}>
    <div className="relative flex items-center">
      <Search className="pointer-events-none absolute left-3 z-10 h-4 w-4 text-gray-400" />
      <input
        className={`w-full rounded-lg border border-gray-700 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 ${
          isMobile ? "bg-gray-800" : "bg-gray-800/50"
        }`}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder="Pesquisar projetos..."
        type="text"
        value={value}
      />

      <AnimatePresence>
        {value && (
          <motion.button
            animate={{ opacity: 1 }}
            className="absolute right-3 flex h-4 w-4 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-700/30 hover:text-white"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClear}
            type="button"
          >
            <X className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  </form>
)

const UserMenuItems = ({ onItemClick, onLogout, isMobile = false }: any) => {
  const menuItems = [
    {
      label: "Meu Dashboard",
      href: "/dashboard",
      icon: BarChart3,
      description: "Visão geral",
    },
    {
      label: "Configurações",
      href: "/settings",
      icon: Settings,
      description: "Minha conta",
    },
  ]

  const baseItemClass = isMobile
    ? "w-full text-left px-3 py-2 text-gray-300 hover:text-orange-400 transition-all duration-150 flex items-center space-x-2"
    : "w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-150 flex items-center space-x-3"

  return (
    <>
      {menuItems.map((item) => {
        const Icon = item.icon
        return (
          <button
            className={baseItemClass}
            key={item.href}
            onClick={() => onItemClick(item.href)}
            type="button"
          >
            <Icon className={isMobile ? "h-4 w-4" : "h-5 w-5 text-gray-400"} />
            {isMobile ? (
              <span>{item.label}</span>
            ) : (
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-gray-500 text-xs">{item.description}</div>
              </div>
            )}
          </button>
        )
      })}
      <button
        className={`flex w-full items-center border-t text-left text-red-400 transition-all duration-150 hover:text-red-300 ${
          isMobile
            ? "mt-2 space-x-2 border-gray-700/50 px-3 py-2 pt-4"
            : "space-x-3 border-gray-700 px-4 py-3 hover:bg-red-500/10"
        }`}
        onClick={onLogout}
        type="button"
      >
        <LogOut className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
        {isMobile ? (
          <span>Sair</span>
        ) : (
          <div>
            <div className="font-medium">Sair</div>
            <div className="text-gray-500 text-xs">Fazer logout</div>
          </div>
        )}
      </button>
    </>
  )
}

const AuthButtons = ({ onLoginClick, onRegisterClick }: any) => (
  <div className="flex items-center space-x-4">
    <button
      className="px-4 py-2 text-gray-300 transition-colors hover:text-white"
      onClick={onLoginClick}
      type="button"
    >
      Entrar
    </button>
    <button
      className="rounded-lg bg-linear-to-r from-orange-500 to-red-500 px-6 py-2 font-medium text-white transition-all duration-200 hover:from-orange-600 hover:to-red-600 hover:shadow-lg hover:shadow-orange-500/20"
      onClick={onRegisterClick}
      type="button"
    >
      Cadastrar
    </button>
  </div>
)

// --- COMPONENTE PRINCIPAL ---

export function Header() {
  const { user, userType, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const searchSuggestions = useMemo(
    () => [
      "React",
      "Python",
      "Node.js",
      "TypeScript",
      "Data Science",
      "DevOps",
    ],
    []
  )

  const filteredSuggestions = useMemo(
    () =>
      searchSuggestions
        .filter(
          (s) =>
            s.toLowerCase().includes(searchTerm.toLowerCase()) &&
            searchTerm.length > 0
        )
        .slice(0, 5),
    [searchSuggestions, searchTerm]
  )

  // --- CORREÇÃO DO BUG DE SCROLL ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)

    // 1. Verifica o scroll imediatamente ao montar o componente
    handleScroll()

    // 2. Adiciona o listener para mudanças futuras
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(".user-menu-container")) {
        setShowUserMenu(false)
      }
      if (!target.closest(".search-container")) {
        setShowSearchSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/empresas?search=${encodeURIComponent(searchTerm)}`)
      setShowSearchSuggestions(false)
      setIsMenuOpen(false)
      setSearchTerm("")
    }
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    setIsMenuOpen(false)
    navigate("/")
  }

  const getInitials = (name: string) => {
    if (!name) {
      return "U"
    }
    const parts = name.trim().split(" ")
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase()
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return (
    <motion.header
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-gray-700/50 border-b bg-gray-900/80 shadow-lg backdrop-blur-lg"
          : "bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <div className="group flex cursor-pointer items-center space-x-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105">
                <img
                  alt="Logo"
                  className="rounded-full object-cover"
                  height={40}
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.parentElement!.innerHTML =
                      '<div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">DS</div>'
                  }}
                  src="/logo-codify.png"
                  width={40}
                />
              </div>
              <div className="shrink-0">
                <h1 className="font-bold text-2xl text-white transition-colors duration-300 group-hover:text-orange-300">
                  DevStart
                </h1>
              </div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="search-container relative mx-8 hidden max-w-md flex-1 lg:flex">
            <SearchInput
              onChange={(e: any) => {
                setSearchTerm(e.target.value)
                setShowSearchSuggestions(true)
              }}
              onClear={() => setSearchTerm("")}
              onFocus={() => setShowSearchSuggestions(searchTerm.length > 0)}
              onSubmit={handleSearchSubmit}
              value={searchTerm}
            />

            <AnimatePresence>
              {showSearchSuggestions && filteredSuggestions.length > 0 && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-lg"
                  exit={{ opacity: 0, y: 5 }}
                  initial={{ opacity: 0, y: 5 }}
                >
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      className="flex w-full items-center space-x-2 px-4 py-3 text-left text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                      key={suggestion}
                      onClick={() => {
                        setSearchTerm(suggestion)
                        navigate(
                          `/empresas?search=${encodeURIComponent(suggestion)}`
                        )
                        setShowSearchSuggestions(false)
                      }}
                      type="button"
                    >
                      <Search className="h-4 w-4 text-gray-500" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation - Desktop */}
          <nav className="mr-12 hidden lg:block">
            <div className="flex items-center space-x-12">
              <NavigationLinks
                isAuthenticated={isAuthenticated}
                pathname={location.pathname}
                userType={userType}
              />
            </div>
          </nav>

          {/* Auth / User Menu - Desktop */}
          <div className="hidden items-center space-x-6 lg:flex">
            {isAuthenticated && user ? (
              <div className="user-menu-container relative">
                <button
                  className="group flex cursor-pointer items-center space-x-3"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  type="button"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-105">
                    <span className="font-bold text-sm text-white">
                      {getInitials(user.nome)}
                    </span>
                  </div>
                  <div className="hidden text-left xl:block">
                    <div className="font-medium text-gray-300 text-sm transition-colors group-hover:text-white">
                      {user.nome.split(" ")[0]}
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-2xl"
                      exit={{ opacity: 0, y: 10 }}
                      initial={{ opacity: 0, y: 10 }}
                    >
                      <div className="bg-linear-to-r from-orange-500 to-red-500 p-5">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 font-bold text-lg text-white backdrop-blur-sm">
                            {getInitials(user.nome)}
                          </div>
                          <div className="overflow-hidden">
                            <p className="truncate font-semibold text-white">
                              {user.nome}
                            </p>
                            <p className="truncate text-white/80 text-xs">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <UserMenuItems
                          onItemClick={(href: string) => {
                            setShowUserMenu(false)
                            navigate(href)
                          }}
                          onLogout={handleLogout}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <AuthButtons
                onLoginClick={() => navigate("/auth?mode=login")}
                onRegisterClick={() => navigate("/auth?mode=register")}
              />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 text-gray-400 transition-colors hover:text-white lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden border-gray-800 border-t bg-gray-900 lg:hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
          >
            <div className="space-y-6 px-4 py-6">
              {/* Mobile Search */}
              <SearchInput
                isMobile={true}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
                onSubmit={(e: any) => {
                  handleSearchSubmit(e)
                  setIsMenuOpen(false)
                }}
                value={searchTerm}
              />

              {/* Mobile Navigation */}
              <div className="space-y-2">
                <NavigationLinks
                  isAuthenticated={isAuthenticated}
                  isMobile={true}
                  onItemClick={() => setIsMenuOpen(false)}
                  pathname={location.pathname}
                  userType={userType}
                />{" "}
              </div>

              {/* Mobile User Section */}
              <div className="border-gray-800 border-t pt-6">
                {isAuthenticated && user ? (
                  <div>
                    <div className="mb-4 flex items-center space-x-3 px-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-orange-500 to-red-500 font-bold text-white">
                        {getInitials(user.nome)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.nome}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <UserMenuItems
                      isMobile={true}
                      onItemClick={(href: string) => {
                        navigate(href)
                        setIsMenuOpen(false)
                      }}
                      onLogout={handleLogout}
                    />
                  </div>
                ) : (
                  <div className="space-y-3 px-1">
                    <button
                      className="w-full rounded-lg border border-gray-700 py-3 text-center text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                      onClick={() => {
                        navigate("/auth?mode=login")
                        setIsMenuOpen(false)
                      }}
                      type="button"
                    >
                      Entrar
                    </button>
                    <button
                      className="w-full rounded-lg bg-linear-to-r from-orange-500 to-red-500 py-3 text-center font-medium text-white transition-colors hover:from-orange-600 hover:to-red-600"
                      onClick={() => {
                        navigate("/auth?mode=register")
                        setIsMenuOpen(false)
                      }}
                      type="button"
                    >
                      Cadastrar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
