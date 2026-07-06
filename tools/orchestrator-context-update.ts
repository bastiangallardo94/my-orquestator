import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"

export default tool({
  description: "Hace merge inteligente de context.md. Agrega contenido nuevo sin duplicar. Si una línea ya existe, no la repite.",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    new_content: tool.schema.string().describe("Contenido nuevo a agregar (en formato markdown)"),
    section: tool.schema.string().optional().describe("Sección donde agregar (ej: last_phases, pending_work, decisions). Default: detecta automáticamente"),
    dry_run: tool.schema.boolean().optional().describe("Solo mostrar qué cambiaría sin escribir (default: false)")
  },
  async execute(args, ctx) {
    const ctxPath = path.join(args.project_path, ".orquestador", "context.md")
    const existingContent = fs.existsSync(ctxPath) ? fs.readFileSync(ctxPath, "utf-8") : ""

    const newLines = args.new_content.split("\n").filter(l => l.trim())
    const existingLines = existingContent.split("\n").filter(l => l.trim())

    // Find duplicates (exact match and fuzzy match)
    const duplicateSet = new Set<string>()
    for (const newLine of newLines) {
      const normalized = newLine.toLowerCase().trim()
      for (const exLine of existingLines) {
        if (exLine.toLowerCase().trim() === normalized) {
          duplicateSet.add(newLine)
          break
        }
        // Fuzzy: skip very short lines or lines that are just symbols
        if (normalized.length > 10 && exLine.toLowerCase().includes(normalized)) {
          duplicateSet.add(newLine)
          break
        }
      }
    }

    const uniqueLines = newLines.filter(l => !duplicateSet.has(l))

    if (uniqueLines.length === 0) {
      return JSON.stringify({
        skipped: newLines.length,
        added: 0,
        dry_run: args.dry_run ?? false,
        summary: "Todo el contenido nuevo ya existe en context.md — no se agregó nada",
      })
    }

    // Determine where to insert
    let output: string
    let insertLabel = `## Update ${new Date().toISOString().split("T")[0]}`

    if (args.section) {
      // Insert after the section header
      const sectionPattern = new RegExp(`^##\\s+${args.section}\\s*$`, "i")
      const sectionIdx = existingContent.split("\n").findIndex(l => sectionPattern.test(l.trim()))
      if (sectionIdx !== -1) {
        const lines = existingContent.split("\n")
        lines.splice(sectionIdx + 1, 0, "", ...uniqueLines)
        output = lines.join("\n")
        insertLabel = `Section [${args.section}]`
      } else {
        // Section doesn't exist, append at end
        output = existingContent + "\n\n## " + args.section + "\n" + uniqueLines.join("\n")
        insertLabel = `Appended as [${args.section}]`
      }
    } else {
      // Auto: append at end with timestamp
      output = existingContent + "\n\n" + insertLabel + "\n" + uniqueLines.join("\n")
    }

    if (args.dry_run ?? false) {
      return JSON.stringify({
        dry_run: true,
        skipped_duplicates: duplicateSet.size,
        would_add: uniqueLines,
        current_lines: existingLines.length,
        after_lines: existingLines.length + uniqueLines.length,
        summary: `DRY RUN: Se agregarían ${uniqueLines.length} líneas nuevas (${duplicateSet.size} duplicados omitidos)`,
      })
    }

    fs.writeFileSync(ctxPath, output, "utf-8")

    return JSON.stringify({
      skipped_duplicates: duplicateSet.size,
      added: uniqueLines.length,
      total_lines_after: existingLines.length + uniqueLines.length,
      summary: `${insertLabel}: ${uniqueLines.length} líneas agregadas, ${duplicateSet.size} duplicados omitidos`,
    }, null, 2)
  },
})
