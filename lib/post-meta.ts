export const postCategories = ["macro", "equity", "market-notes"] as const

export type PostCategory = (typeof postCategories)[number]
export type SidebarValueTone = "neutral" | "positive" | "warning" | "negative"

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
  eyebrow?: string
  stance?: string
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
