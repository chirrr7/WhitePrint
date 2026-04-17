"use client"

import { useEffect, useRef } from "react"
import s from "./article.module.css"

export function ArticleProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function update() {
      const el = barRef.current
      if (!el) return
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0
      el.style.width = `${Math.min(100, pct)}%`
    }
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return <div ref={barRef} className={s.progress} aria-hidden="true" />
}
