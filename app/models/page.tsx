import type { Metadata } from "next"
import { getAllModels } from "@/lib/models"
import { Download } from "lucide-react"

export const metadata: Metadata = {
  title: "Models Library",
  description:
    "Downloadable financial models including DCF templates, LBO models, and macro dashboards.",
}

export default function ModelsPage() {
  const models = getAllModels()

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 pb-8 border-b border-border">
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Models Library
        </h1>
        <p className="mt-3 text-muted-foreground max-w-lg leading-relaxed">
          Downloadable financial models and analytical tools. Built for
          practitioners, designed for clarity.
        </p>
      </header>

      <div className="flex flex-col gap-0 divide-y divide-border">
        {models.map((model) => (
          <div key={model.slug} className="py-8 flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  {model.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {model.format}
                </span>
              </div>
              <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                {model.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">
                {model.description}
              </p>
            </div>
            <a
              href={model.downloadUrl}
              className="inline-flex items-center gap-2 border border-foreground bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:bg-background hover:text-foreground transition-colors shrink-0"
              download
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
