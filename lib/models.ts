export interface FinancialModel {
  slug: string
  title: string
  description: string
  format: string
  fileSize?: string
  category: string
  downloadUrl: string
}

export function getAllModels(): FinancialModel[] {
  return [
    {
      slug: "eog-resources-dcf",
      title: "EOG Resources DCF Model",
      description:
        "Four-scenario discounted cash flow model for EOG Resources. Covers Base, Conflict-Up, Bull, and Bear cases with WTI sensitivity and WACC analysis. Includes probability-weighted price target and key assumptions dashboard.",
      format: "Excel (.xlsx)",
      category: "Equity",
      downloadUrl: "/models/eog-resources-dcf.xlsx",
    },
  ]
}
