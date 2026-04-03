import { getPublicDocketItems } from "@/lib/public-site"
import s from "./PipelineDocket.module.css"

const categoryClassMap: Record<string, string> = {
  GEO: s.catGeo,
  EQ: s.catEq,
  MACRO: s.catMacro,
  FOR: s.catFor,
  CRED: s.catCred,
}

export async function PipelineDocket() {
  const items = await getPublicDocketItems()
  const updatedLabel = items.find((item) => item.updatedLabel)?.updatedLabel ?? null

  if (items.length === 0) {
    return null
  }

  return (
    <section className={s.section} id="pipeline">
      <div id="pipeline-nav-sentinel" className={s.sentinel} aria-hidden="true" />

      <div className={s.wrap}>
        <div className={s.headerRow}>
          <span className={s.labelMono}>Research Docket</span>
          <div className={s.rule} />
          <span className={s.meta}>{updatedLabel ? `Updated ${updatedLabel}` : ""}</span>
        </div>

        <p className={s.descriptor}>Active work in progress. No publication dates given.</p>

        <div className={s.items}>
          {items.map((item) => (
            <article key={item.id} className={`${s.item} fade-in-up`}>
              <div>
                {item.categoryLabels.length ? (
                  <div className={s.cats}>
                    {item.categoryLabels.map((category) => (
                      <span
                        key={category}
                        className={`${s.cat} ${categoryClassMap[category] ?? s.catMacro}`}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className={s.codename}>{item.codename}</div>

                <div className={s.titleBlock}>
                  {item.redacted ? (
                    <div className={s.titleRedacted}>
                      <span className={s.titleRedactedText}>CLASSIFIED / REDACTED</span>
                    </div>
                  ) : (
                    <h3 className={s.titleRevealed}>{item.title}</h3>
                  )}
                  {item.redacted ? (
                    <div className={s.subtitleRedacted}>Details withheld pending publication</div>
                  ) : item.subtitle ? (
                    <div className={s.subtitleRevealed}>{item.subtitle}</div>
                  ) : null}
                </div>

                {item.format ? <div className={s.format}>{item.format}</div> : null}
              </div>

              <div>
                {item.hook ? <p className={s.hook}>{item.hook}</p> : null}

                <div className={s.footer}>
                  {item.statusLabel ? (
                    <span className={`${s.status} ${getStatusClassName(item.statusTone)}`}>
                      {item.statusLabel}
                    </span>
                  ) : null}
                  {item.updatedLabel ? <span className={s.updated}>{item.updatedLabel}</span> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function getStatusClassName(statusType: "active" | "drafting" | "research") {
  switch (statusType) {
    case "active":
      return s.statusActive
    case "drafting":
      return s.statusDrafting
    default:
      return s.statusResearch
  }
}
