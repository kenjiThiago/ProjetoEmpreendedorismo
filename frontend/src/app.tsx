import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom" // Adicione Navigate
import { AuthProvider, useAuth } from "./contexts/auth_context" // Adicione useAuth
import { AdminDashboard } from "./pages/admin_dashboard"
import { AuthPage } from "./pages/auth"
import { CompanyDashboard } from "./pages/company_dashboard"
import { DashboardPageContent } from "./pages/dashboard"
import { CompanyPageContent } from "./pages/empresas"
import { Home } from "./pages/home"
import { PlanosPageContent } from "./pages/planos"
import { ProjectDetailsPage } from "./pages/project_details"
import { TalentosPage } from "./pages/talentos"
import { Vagas } from "./pages/vagas"

const queryClient = new QueryClient()

function ProtectedDashboard() {
  const { user, userType, isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!(isAuthenticated && user)) {
    return <Navigate replace to="/auth?mode=login" />
  }

  if (userType === "company") {
    return <CompanyDashboard companyName={user.nome} />
  }

  return <DashboardPageContent cpf={user.cpf || ""} />
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Home />} index />
            <Route element={<AuthPage />} path="/auth" />
            <Route element={<Vagas />} path="/vagas" />
            <Route element={<PlanosPageContent />} path="/planos" />
            <Route element={<CompanyPageContent />} path="/empresas" />

            <Route element={<ProtectedDashboard />} path="/dashboard" />
            <Route element={<TalentosPage />} path="/talentos" />
            <Route element={<ProjectDetailsPage />} path="/projetos/:id" />
            <Route element={<AdminDashboard />} path="/admin" />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
