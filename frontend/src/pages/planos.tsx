import { useState } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PlanosContent } from "@/components/planos/planos_content"
import { PlanosFAQ } from "@/components/planos/planos_faq"
import { PlanosFeatures } from "@/components/planos/planos_features"
import { PlanosHero } from "@/components/planos/planos_hero"

export type ViewMode = "student" | "company"

export function PlanosPageContent() {
  const [viewMode, setViewMode] = useState<ViewMode>("student")

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main>
        <PlanosHero setViewMode={setViewMode} viewMode={viewMode} />
        <PlanosContent viewMode={viewMode} />
        <PlanosFeatures viewMode={viewMode} />
        <PlanosFAQ viewMode={viewMode} />
      </main>

      <Footer />
    </div>
  )
}
