export const postCategories = ["macro", "equity", "market-notes"] as const

export type PostCategory = (typeof postCategories)[number]
export type SidebarValueTone = "neutral" | "positive" | "warning" | "negative"
export type PostStance = "cautious" | "neutral" | "constructive"
export type PostConviction = "high" | "medium" | "low"

export interface MarketNoteTableData {
  stance: string
  confidence: string
  horizon: string
  quickAnswer: string
  whatChangesOurMind: string
}

export interface ReportDownloadData {
  href: string
  filename: string
  label?: string
}

export interface SidebarCardRow {
  label: string
  value: string
  tone?: SidebarValueTone
}

export interface SidebarCard {
  title: string
  rows: SidebarCardRow[]
  note?: string
}

export interface PostMeta {
  slug: string
  title: string
  date: string
  category: PostCategory
  tags: string[]
  excerpt: string
  readTime: number
  ticker?: string
  name?: string
  stance?: PostStance
  conviction?: PostConviction
  stanceThesis?: string
  stanceMetric?: string
  bear?: number
  base?: number
  bull?: number
  displayTitle?: string
  eyebrow?: string
  marketNoteTable?: MarketNoteTableData
  reportDownload?: ReportDownloadData
  sidebarCards?: SidebarCard[]
}

export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function getPostCategoryLabel(category: PostCategory): string {
  switch (category) {
    case "macro":
      return "Macro"
    case "equity":
      return "Equity Research"
    case "market-notes":
      return "Market Notes"
    default:
      return category
  }
}

export function getPostCategoryHref(category: PostCategory): string {
  switch (category) {
    case "macro":
      return "/macro"
    case "equity":
      return "/equity"
    case "market-notes":
      return "/market-notes"
    default:
      return "/"
  }
}
