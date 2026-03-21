import type { Metadata } from "next"
import Link from "next/link"
import { getAllModels, type FinancialModel } from "@/lib/models"
import { DownloadButton } from "./download-button"

export const metadata: Metadata = {
  title: "Models Library",
  description:
    "Downloadable financial models and analytical tools. Built for practitioners, designed for clarity.",
}

const MONO = '"JetBrains Mono", monospace'
const DISPLAY = '"Playfair Display", Georgia, serif'
const SERIF = '"Source Serif 4", Georgia, serif'

const v = {
  bg: "#f7f6f3",
  surface: "#fff",
  ink: "#0a0a0a",
  accent: "#b83025",
  muted: "#555",
  subtle: "#8a8a8a",
  border: "#dedad4",
  borderLight: "#eceae5",
  tagBg: "#edeae4",
}

export default function ModelsPage() {
  const models = getAllModels()

  // Group by category, preserving insertion order
  const grouped = models.reduce<Record<string, FinancialModel[]>>((acc, model) => {
    if (!acc[model.category]) acc[model.category] = []
    acc[model.category].push(model)
    return acc
  }, {})

  const categories = Object.keys(grouped)

  return (
    <div style={{ background: v.bg, minHeight: "100vh" }}>

      {/* Page header */}
      <div
        style={{
          background: v.surface,
          borderBottom: `1px solid ${v.border}`,
          padding: "56px 40px 48px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 9,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: v.subtle,
              marginBottom: 16,
            }}
          >
            Whiteprint Research
          </div>
          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: v.ink,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Models Library
          </h1>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 16,
              color: v.muted,
              marginTop: 14,
              lineHeight: 1.7,
              maxWidth: 520,
              fontStyle: "italic",
              fontWeight: 300,
            }}
          >
            Downloadable financial models built alongside published research.
            Each model reflects the assumptions and scenarios from the corresponding analysis.
          </p>
        </div>
      </div>

      {/* Models list */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 80px" }}>

        {models.length === 0 ? (
          <div
            style={{
              padding: "80px 0",
              textAlign: "center",
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: v.subtle,
            }}
          >
            No models published yet.
          </div>
        ) : (
          categories.map((category) => (
            <section key={category}>
              {/* Section label */}
              <div
                style={{
                  borderBottom: `1px solid ${v.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "36px 0 0",
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: v.subtle,
                    paddingBottom: 14,
                    fontSize: 9,
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {category}
                </span>
                <div
                  style={{
                    background: v.borderLight,
                    flex: 1,
                    height: 1,
                    marginBottom: 14,
                  }}
                />
              </div>

              {grouped[category].map((model) => (
                <ModelRow key={model.slug} model={model} />
              ))}
            </section>
          ))
        )}


      </div>
    </div>
  )
}

function ModelRow({ model }: { model: FinancialModel }) {
  return (
    <article
      style={{
        borderTop: `1px solid ${v.border}`,
        padding: "32px 0 28px",
        display: "flex",
        alignItems: "flex-start",
        gap: 48,
      }}
    >
      {/* Left: info */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: MONO,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              background: v.ink,
              color: "#fff",
              padding: "3px 9px",
              fontSize: 9,
              fontWeight: 500,
            }}
          >
            {model.category}
          </span>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 9,
              letterSpacing: "0.1em",
              color: v.subtle,
              textTransform: "uppercase",
            }}
          >
            {model.format}
            {model.fileSize ? ` · ${model.fileSize}` : ""}
          </span>
        </div>

        <h2
          style={{
            fontFamily: DISPLAY,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: v.ink,
            margin: 0,
            lineHeight: 1.18,
          }}
        >
          {model.title}
        </h2>

        <p
          style={{
            fontFamily: SERIF,
            fontSize: 14,
            color: v.muted,
            margin: 0,
            lineHeight: 1.7,
            maxWidth: 560,
          }}
        >
          {model.description}
        </p>
      </div>

      {/* Right: download button */}
      <div style={{ flexShrink: 0, paddingTop: 4 }}>
        <DownloadButton href={model.downloadUrl} filename={`${model.slug}.xlsx`} />
      </div>
    </article>
  )
}

