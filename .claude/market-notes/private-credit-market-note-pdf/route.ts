import { readFile } from "fs/promises"
import path from "path"

export const runtime = "nodejs"

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "app",
    "market-notes",
    "private-credit-market-note-whiteprint-revised.pdf",
  )

  try {
    const pdf = await readFile(filePath)

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="private-credit-market-note-whiteprint-revised.pdf"',
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return new Response("PDF not found", { status: 404 })
  }
}
