import { useState } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Features } from "@/components/home/features"
import { Hero } from "@/components/home/hero"
import { useHomeInfo } from "@/http/use_home_info"

export type HomeViewMode = "student" | "company"

export function Home() {
  const { data } = useHomeInfo()
  const [viewMode, setViewMode] = useState<HomeViewMode>("student")

  const smartRound = (num: number | undefined): number => {
    if (num === undefined) {
      return 0
    }

    if (num < 10) {
      return num
    }

    const digits = num.toString().length
    const base = 10 ** (digits - 1)

    return Math.floor(num / base) * base
  }

  const roundedStats = {
    students: smartRound(data?.num_alunos),
    projects: smartRound(data?.num_projetos),
    companies: smartRound(data?.num_empresas),
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <Hero
        numStudents={data?.num_alunos}
        setViewMode={setViewMode}
        viewMode={viewMode}
      />
      <Features
        numCompanies={roundedStats.companies}
        numProjects={roundedStats.projects}
        numStudents={roundedStats.students}
        viewMode={viewMode}
      />

      <Footer />
    </div>
  )
}
