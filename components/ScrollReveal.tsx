"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    let frameId = 0
    let observer: IntersectionObserver | null = null

    const attachObserver = () => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(".fade-in-up"))

      if (!elements.length) {
        frameId = window.requestAnimationFrame(attachObserver)
        return
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return
            }

            entry.target.classList.add("in-view")
            observer?.unobserve(entry.target)
          })
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -40px 0px",
        },
      )

      elements.forEach((element) => observer?.observe(element))
    }

    attachObserver()

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      observer?.disconnect()
    }
  }, [pathname])

  return null
}
