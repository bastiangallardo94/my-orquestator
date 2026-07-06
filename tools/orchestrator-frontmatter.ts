import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"

export default tool({
  description: "Parsea SOLO el frontmatter YAML de un archivo .md sin leer el body. Extrae phase_id, type, agent, entry_condition, hash_inputs, exit_check, exit_files, max_retries.",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    file_path: tool.schema.string().describe("Ruta relativa al archivo .md (ej: skills/orquestador_v2/prompts/phase_1_analyze.md)")
  },
  async execute(args, ctx) {
    const fullPath = path.join(args.project_path, args.file_path)

    if (!fs.existsSync(fullPath)) {
      return JSON.stringify({ error: `Archivo no encontrado: ${args.file_path}` })
    }

    const content = fs.readFileSync(fullPath, "utf-8")
    const lines = content.split("\n")

    // Find YAML delimiters
    const startIdx = lines.findIndex(l => l.trim() === "---")
    if (startIdx === -1) {
      return JSON.stringify({ error: "No tiene frontmatter YAML" })
    }

    const endIdx = lines.findIndex((l, i) => i > startIdx && l.trim() === "---")
    if (endIdx === -1) {
      return JSON.stringify({ error: "Frontmatter sin closing ---" })
    }

    const yamlLines = lines.slice(startIdx + 1, endIdx)
    const parsed: Record<string, any> = {}

    for (const line of yamlLines) {
      const colonIdx = line.indexOf(":")
      if (colonIdx === -1) continue
      const key = line.slice(0, colonIdx).trim()
      const value = line.slice(colonIdx + 1).trim()

      if (value.startsWith("[") && value.endsWith("]")) {
        // Array: ["a", "b"]
        parsed[key] = value
          .slice(1, -1)
          .split(",")
          .map(s => s.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean)
      } else if (value === "true") {
        parsed[key] = true
      } else if (value === "false") {
        parsed[key] = false
      } else if (!isNaN(Number(value)) && value !== "") {
        parsed[key] = Number(value)
      } else {
        parsed[key] = value
      }
    }

    return JSON.stringify({
      file: args.file_path,
      frontmatter: parsed,
      summary: `phase_id=${parsed.phase_id || "N/A"} type=${parsed.type || "N/A"} agent=${parsed.agent || "N/A"}`,
    }, null, 2)
  },
})
