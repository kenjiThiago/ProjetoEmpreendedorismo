import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/auth_context"

// Importação das Páginas (Caminhos relativos para evitar erros)
import { AdminDashboard } from "./pages/admin_dashboard"
import { AuthPage } from "./pages/auth"
import { CompanyDashboard } from "./pages/company_dashboard"
import { DashboardPageContent } from "./pages/dashboard"
import { CompanyPageContent } from "./pages/empresas"
import { Home } from "./pages/home"
import { PlanosPageContent } from "./pages/planos"
import { ProjectDetailsPage } from "./pages/project_details"
import { TalentosPage } from "./pages/talentos"

const queryClient = new QueryClient()

// --- 1. Proteção para Dashboard (Aluno/Empresa) ---
// Redireciona Admin para /admin e bloqueia não logados
function ProtectedDashboard() {
  const { user, userType, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    )
  }

  // Se não estiver logado, manda pro login
  if (!(isAuthenticated && user)) {
    return <Navigate replace to="/auth?mode=login" />
  }

  // Se for Admin, não deve ver o dashboard de usuário comum
  if (userType === "admin") {
    return <Navigate replace to="/admin" />
  }

  // Se for Empresa
  if (userType === "company") {
    return <CompanyDashboard companyName={user.nome} />
  }

  // Se for Estudante (Default)
  return <DashboardPageContent cpf={user.cpf || ""} />
}

// --- 2. Proteção Exclusiva para Admin ---
// Só permite acesso se userType for "admin"
function ProtectedAdmin() {
  const { user, userType, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
      </div>
    )
  }

  // Se não logado, login
  if (!(isAuthenticated && user)) {
    return <Navigate replace to="/auth?mode=login" />
  }

  // Se logado mas NÃO for admin, manda pro dashboard dele
  if (userType !== "admin") {
    return <Navigate replace to="/dashboard" />
  }

  // Se for Admin, libera o acesso
  return <AdminDashboard />
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas */}
            <Route element={<Home />} index />
            <Route element={<AuthPage />} path="/auth" />
            <Route element={<PlanosPageContent />} path="/planos" />

            {/* Vitrines (Acesso livre) */}
            <Route element={<CompanyPageContent />} path="/empresas" />
            <Route element={<TalentosPage />} path="/talentos" />
            <Route element={<ProjectDetailsPage />} path="/projetos/:id" />

            {/* Rotas Protegidas */}
            <Route element={<ProtectedDashboard />} path="/dashboard" />
            <Route element={<ProtectedAdmin />} path="/admin" />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
