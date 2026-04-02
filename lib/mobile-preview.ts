export const MOBILE_PREVIEW_QUERY_KEY = "mobile"
export const MOBILE_PREVIEW_QUERY_VALUE = "1"

export function isMobilePreviewEnabled(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value.includes(MOBILE_PREVIEW_QUERY_VALUE)
  }

  return value === MOBILE_PREVIEW_QUERY_VALUE
}

export function withMobilePreviewHref(href: string, preservePreview = false) {
  if (!preservePreview || !href.startsWith("/")) {
    return href
  }

  const [pathAndQuery, hash = ""] = href.split("#", 2)
  const [pathname, query = ""] = pathAndQuery.split("?", 2)
  const params = new URLSearchParams(query)

  params.set(MOBILE_PREVIEW_QUERY_KEY, MOBILE_PREVIEW_QUERY_VALUE)

  const nextQuery = params.toString()
  const nextHash = hash ? `#${hash}` : ""

  return nextQuery ? `${pathname}?${nextQuery}${nextHash}` : `${pathname}${nextHash}`
}
