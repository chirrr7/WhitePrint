import { getFilesystemPosts } from "@/lib/posts"
import {
  getPostCategoryLabel,
  type PostConviction,
  type PostScenarioType,
  type PostStance,
  type PostStatus,
} from "@/lib/post-meta"

export interface Stance {
  ticker: string
  name: string
  category: string
  stance: PostStance
  conviction: PostConviction
  thesis: string
  status: PostStatus
  scenarioType: PostScenarioType
  bear: number | null
  base: number | null
  bull: number | null
  date: string
  slug: string
}

const stanceDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

function formatStanceDate(date: string) {
  return stanceDateFormatter.format(new Date(`${date}T00:00:00`))
}

export function getStances(): Stance[] {
  return getFilesystemPosts()
    .filter((post) => Boolean(post.ticker && post.stance))
    .sort((left, right) => {
      if (left.date === right.date) {
        return left.title.localeCompare(right.title)
      }

      return left.date > right.date ? -1 : 1
    })
    .map((post) => ({
      ticker: post.ticker!,
      name: post.name ?? post.title,
      category: getPostCategoryLabel(post.category),
      stance: post.stance!,
      conviction: post.conviction ?? "medium",
      thesis: post.stanceThesis ?? post.excerpt,
      status: post.status ?? "active",
      scenarioType: post.scenarioType ?? "price",
      bear: post.bear ?? null,
      base: post.base ?? null,
      bull: post.bull ?? null,
      date: formatStanceDate(post.date),
      slug: post.slug,
    }))
}
