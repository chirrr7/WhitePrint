import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description:
    "About Whiteprint -- independent research focused on macro, equities, and market structure.",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10 pb-8 border-b border-border">
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          About
        </h1>
      </header>

      <div className="flex flex-col gap-10">
        {/* Author */}
        <section>
          <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground mb-4">
            The Author
          </h2>
          <div className="text-sm text-foreground leading-relaxed flex flex-col gap-4 max-w-xl">
            <p>
              Whiteprint is written by an independent research analyst with
              experience across macro trading, equity research, and risk
              management at institutional firms.
            </p>
            <p>
              After years inside the institutional framework, the goal became
              clear: produce the kind of research that prioritizes intellectual
              honesty over marketing, and analysis over narrative.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="border-t border-border pt-10">
          <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground mb-4">
            Mission
          </h2>
          <div className="text-sm text-foreground leading-relaxed flex flex-col gap-4 max-w-xl">
            <p>
              Whiteprint exists to provide rigorous, independent analysis of
              macroeconomic trends, company fundamentals, and market structure.
              Every piece is written with the same standard applied to
              institutional research -- but without the conflicts of interest.
            </p>
            <p>
              The focus is on depth over frequency. Each post is a considered
              view, not a reaction to the news cycle. The models are built to be
              used, not admired. The goal is to help serious investors think more
              clearly about risk and opportunity.
            </p>
          </div>
        </section>

        {/* Principles */}
        <section className="border-t border-border pt-10">
          <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground mb-4">
            Principles
          </h2>
          <div className="flex flex-col gap-6">
            {[
              {
                title: "Independence",
                text: "No institutional affiliations, no conflicts, no book to talk. The analysis stands on its own merits.",
              },
              {
                title: "Rigor",
                text: "Every claim is grounded in data. Every model is stress-tested. Assumptions are stated explicitly and challenged systematically.",
              },
              {
                title: "Clarity",
                text: "Complex ideas deserve clear expression. Jargon is minimized. If something can be said simply, it should be.",
              },
              {
                title: "Humility",
                text: "Markets are humbling. Uncertainty is acknowledged, not hidden. Probabilistic thinking over conviction narratives.",
              },
            ].map((principle) => (
              <div key={principle.title}>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {principle.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  {principle.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-border pt-10">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
            All content published on Whiteprint is for informational and
            educational purposes only. Nothing herein constitutes investment
            advice, a recommendation, or a solicitation to buy or sell any
            security. Always conduct your own due diligence.
          </p>
        </section>
      </div>
    </div>
  )
}
