import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config"
import type { Database } from "@/lib/supabase/database.types"
import s from "./PipelineDocket.module.css"

type PipelineCategory = "GEO" | "EQ" | "MACRO" | "FOR" | "CRED"
type PipelineStatusType = "active" | "drafting" | "research"

type PipelineItem = Database["public"]["Tables"]["pipeline"]["Row"] & {
  category: PipelineCategory[]
  status_type: PipelineStatusType | null
}

const categoryClassMap: Record<PipelineCategory, string> = {
  GEO: s.catGeo,
  EQ: s.catEq,
  MACRO: s.catMacro,
  FOR: s.catFor,
  CRED: s.catCred,
}

export async function PipelineDocket() {
  const items = await getPipelineItems()
  const updatedLabel = items.find((item) => item.last_updated)?.last_updated ?? null

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
                <div className={s.cats}>
                  {((item.category ?? []) as PipelineCategory[]).map((category) => (
                    <span key={category} className={`${s.cat} ${categoryClassMap[category]}`}>
                      {category}
                    </span>
                  ))}
                </div>

                <div className={s.codename}>{item.codename}</div>

                <div className={s.titleBlock}>
                  {item.redacted ? (
                    <>
                      <div className={s.titleRedacted}>
                        <span className={s.titleRedactedText}>█████████████████████████</span>
                      </div>
                      <div className={s.subtitleRedacted}>[SUBJECT UNDER RESEARCH]</div>
                    </>
                  ) : (
                    <>
                      <h3 className={s.titleRevealed}>{item.codename}</h3>
                      {item.subtitle ? <div className={s.subtitleRevealed}>{item.subtitle}</div> : null}
                    </>
                  )}
                </div>

                {item.format ? <div className={s.format}>{item.format}</div> : null}
              </div>

              <div>
                {item.hook ? <p className={s.hook}>{item.hook}</p> : null}

                <div className={s.footer}>
                  {item.status ? <span className={`${s.status} ${getStatusClassName(item.status_type)}`}>{item.status}</span> : null}
                  {item.last_updated ? <span className={s.updated}>{item.last_updated}</span> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function getStatusClassName(statusType: PipelineStatusType | null) {
  switch (statusType) {
    case "active":
      return s.statusActive
    case "drafting":
      return s.statusDrafting
    default:
      return s.statusResearch
  }
}

async function getPipelineItems(): Promise<PipelineItem[]> {
  const supabase = createSupabaseClient<Database>(supabaseUrl, supabasePublishableKey)
  const { data, error } = await supabase
    .from("pipeline")
    .select(
      "id, codename, subtitle, redacted, category, hook, format, status, status_type, last_updated, sort_order, visible",
    )
    .eq("visible", true)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("codename", { ascending: true })

  if (error) {
    console.error("Failed to load pipeline items.", error)
    return []
  }

  return ((data ?? []) as PipelineItem[]).filter((item) => item.visible !== false)
}
