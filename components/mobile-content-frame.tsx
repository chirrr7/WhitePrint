"use client"

import { useEffect, useRef, type ReactNode } from "react"
import s from "./mobile-content-frame.module.css"

interface MobileContentFrameProps {
  children: ReactNode
  className?: string
  onOpenTable: (payload: { html: string; title: string }) => void
}

export function MobileContentFrame({
  children,
  className,
  onOpenTable,
}: MobileContentFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = containerRef.current

    if (!root) {
      return
    }

    const explicitWrappers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-mobile-table-modal]"),
    )
    const nakedTables = Array.from(root.querySelectorAll<HTMLElement>("table")).filter(
      (table) => !explicitWrappers.some((wrapper) => wrapper.contains(table)),
    )
    const targets = [
      ...explicitWrappers.map((wrapper, index) => ({
        element: wrapper,
        title:
          wrapper.dataset.mobileTableTitle || `Table ${index + 1}`,
      })),
      ...nakedTables.map((table, index) => ({
        element: table,
        title: table.dataset.mobileTableTitle || `Table ${index + 1}`,
      })),
    ]

    const cleanups: Array<() => void> = []

    targets.forEach(({ element, title }) => {
      if (element.dataset.mobileTableReady === "1") {
        return
      }

      const modalHtml = element.outerHTML
      element.dataset.mobileTableReady = "1"

      const card = document.createElement("button")
      card.type = "button"
      card.className = s.placeholder

      const label = document.createElement("span")
      label.className = s.label
      label.textContent = "Table view"

      const heading = document.createElement("span")
      heading.className = s.title
      heading.textContent = title

      const body = document.createElement("span")
      body.className = s.body
      body.textContent = "Open this table in a full-width sheet."

      const cta = document.createElement("span")
      cta.className = s.trigger
      cta.textContent = "Open table"

      card.append(label, heading, body, cta)

      const handleOpen = () => {
        onOpenTable({
          html: modalHtml,
          title,
        })
      }

      card.addEventListener("click", handleOpen)
      element.style.display = "none"
      element.setAttribute("aria-hidden", "true")
      element.insertAdjacentElement("afterend", card)

      cleanups.push(() => {
        card.removeEventListener("click", handleOpen)
        card.remove()
        element.style.display = ""
        element.removeAttribute("aria-hidden")
        delete element.dataset.mobileTableReady
      })
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [children, onOpenTable])

  return <div ref={containerRef} className={className}>{children}</div>
}
