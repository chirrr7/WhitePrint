"use client"

import { useEffect, useState } from "react"
import styles from "./eog.module.css"

export function ProgressBar() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const d = document.documentElement
      const pct = (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100
      setWidth(Math.min(pct, 100))
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return <div className={styles.progress} style={{ width: `${width}%` }} />
}
