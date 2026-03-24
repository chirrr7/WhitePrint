import type { Metadata } from "next"
import { SEO_CONFIG } from "@/lib/seo.config"

export const metadata: Metadata = {
  title: "About",
  description:
    "About Whiteprint Research — independent macro and equity research.",
  alternates: {
    canonical: `${SEO_CONFIG.siteUrl}/about`,
  },
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
}

export default function AboutPage() {
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
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
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
            About
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
            What we do
          </h1>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 40px 80px" }}>

        {/* Intro */}
        <div style={{ padding: "48px 0 0" }}>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 17,
              lineHeight: 1.75,
              color: v.ink,
              margin: "0 0 20px",
              maxWidth: 660,
            }}
          >
            Whiteprint Research is an independent publication producing macro,
            equity, and sector research at institutional quality.
          </p>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 16,
              lineHeight: 1.75,
              color: v.muted,
              margin: "0 0 20px",
              maxWidth: 660,
            }}
          >
            We cover public equities, macroeconomic policy, credit markets, and
            geopolitical risk — with a focus on primary-source analysis grounded
            in regulatory filings, central bank data, and verifiable financial
            disclosures. Our equity research includes forensic quality-of-earnings
            work, scenario-based valuation, and downloadable financial models
            built for transparency.
          </p>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 16,
              lineHeight: 1.75,
              color: v.muted,
              margin: "0 0 32px",
              maxWidth: 660,
            }}
          >
            We publish on a structured weekly schedule:
          </p>

          {/* Schedule */}
          <div
            style={{
              borderLeft: `2px solid ${v.accent}`,
              paddingLeft: 24,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 0,
            }}
          >
            {[
              ["Monday", "Market Commentary"],
              ["Tuesday", "Credit Analysis"],
              ["Wednesday", "Sector Research"],
              ["Friday", "Equity Commentary"],
              ["Weekend", "Geopolitical and Macro Deep Dives"],
            ].map(([day, topic]) => (
              <div key={day} style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: v.accent,
                    flexShrink: 0,
                    width: 80,
                  }}
                >
                  {day}
                </span>
                <span
                  style={{
                    fontFamily: SERIF,
                    fontSize: 15,
                    color: v.ink,
                    lineHeight: 1.5,
                  }}
                >
                  {topic}
                </span>
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: SERIF,
              fontSize: 15,
              lineHeight: 1.7,
              color: v.muted,
              marginTop: 32,
              fontStyle: "italic",
            }}
          >
            All research is publicly available. All financial models are downloadable.
          </p>
        </div>

        {/* How we work */}
        <Section title="How we work">
          <p>
            Whiteprint operates at the intersection of traditional financial
            analysis and modern research infrastructure. Our analytical process
            is human-led and augmented by AI tooling — used for data extraction,
            model stress-testing, and accelerating the research workflow. The
            judgment, editorial decisions, and conclusions are ours.
          </p>
          <p>
            Every published figure is traceable to a primary source. We do not
            fabricate data, invent precision, or publish unverifiable claims.
            Where uncertainty exists, we say so.
          </p>
        </Section>

        {/* What we believe */}
        <Section title="What we believe">
          <p>
            Good research should be accessible, not gated. The quality of
            analysis should not depend on the size of the institution producing
            it. And the most valuable insight often comes from reading the
            footnotes everyone else skips.
          </p>
        </Section>

        {/* Where we are */}
        <Section title="Where we are">
          <p>
            Based in the UAE with a global research focus. Our coverage spans
            US and European equities, Federal Reserve and ECB policy, energy and
            commodity markets, and cross-border geopolitical risk.
          </p>
        </Section>

        {/* Contact */}
        <Section title="Contact">
          <p>
            For research inquiries, collaboration, or press:
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 4,
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: v.subtle,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Email
              </span>
              <span style={{ fontFamily: SERIF, fontSize: 15, color: v.ink }}>
                contact@whiteprintresearch.xyz
              </span>
            </div>
            <div>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: v.subtle,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                LinkedIn
              </span>
              <a
                href="https://www.linkedin.com/company/whiteprint-research/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: SERIF, fontSize: 15, color: v.ink }}
              >
                Whiteprint Research
              </a>
            </div>
            <div>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: v.subtle,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Instagram
              </span>
              <a
                href="https://www.instagram.com/whiteprintresearch"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: SERIF, fontSize: 15, color: v.ink }}
              >
                @whiteprintresearch
              </a>
            </div>
          </div>
          <p style={{ marginTop: 20 }}>
            We read everything. Response times vary with the publishing schedule.
          </p>
        </Section>

        {/* Disclaimer */}
        <div
          style={{
            marginTop: 60,
            borderTop: `1px solid ${v.borderLight}`,
            paddingTop: 28,
          }}
        >
          <p
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: v.subtle,
              lineHeight: 1.8,
              letterSpacing: "0.03em",
              maxWidth: 660,
              margin: 0,
            }}
          >
            Whiteprint Research is an independent publication. All content is
            for informational and educational purposes only and does not
            constitute investment advice, a recommendation, or a solicitation to
            buy or sell any security. The views expressed represent Whiteprint
            Research analysis as of the date of publication and are subject to
            change without notice. Whiteprint Research is not a registered
            investment adviser, broker-dealer, or financial institution. Readers
            should conduct their own due diligence and consult a qualified
            financial adviser before making investment decisions.
          </p>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: v.subtle,
              letterSpacing: "0.06em",
              marginTop: 16,
            }}
          >
            © 2026 Whiteprint Research. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      style={{
        borderTop: `1px solid ${v.border}`,
        paddingTop: 40,
        marginTop: 48,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: v.subtle,
            flexShrink: 0,
          }}
        >
          {title}
        </span>
        <div style={{ background: v.borderLight, flex: 1, height: 1 }} />
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 16,
          lineHeight: 1.75,
          color: v.muted,
          maxWidth: 660,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {children}
      </div>
    </section>
  )
}
