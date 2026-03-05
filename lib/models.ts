export interface FinancialModel {
  slug: string
  title: string
  description: string
  format: string
  category: string
  downloadUrl: string
}

export function getAllModels(): FinancialModel[] {
  return [
    {
      slug: "dcf-template",
      title: "DCF Valuation Template",
      description:
        "A comprehensive discounted cash flow model with sensitivity analysis, WACC calculation, and terminal value assumptions. Built for public equity analysis.",
      format: "Excel (.xlsx)",
      category: "Valuation",
      downloadUrl: "/models/dcf-template.xlsx",
    },
    {
      slug: "lbo-model",
      title: "LBO Model",
      description:
        "Leveraged buyout model with debt schedule, returns analysis, and operating assumptions. Suitable for private equity transaction modeling.",
      format: "Excel (.xlsx)",
      category: "Transaction",
      downloadUrl: "/models/lbo-model.xlsx",
    },
    {
      slug: "macro-dashboard",
      title: "Macro Indicators Dashboard",
      description:
        "A structured dashboard for tracking key macroeconomic indicators including rates, spreads, and real economy data.",
      format: "PDF (.pdf)",
      category: "Macro",
      downloadUrl: "/models/macro-dashboard.pdf",
    },
  ]
}
