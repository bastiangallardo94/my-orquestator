import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"

export default tool({
  description: "Crea un archivo phases/<id>.json desde el frontmatter YAML de un prompt .md. Si el archivo ya existe, lo actualiza.",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    phase_file: tool.schema.string().describe("Ruta relativa al archivo .md con frontmatter (ej: prompts/phase_3_coding.md)"),
    force: tool.schema.boolean().optional().describe("Sobrescribir si ya existe (default: false)")
  },
  async execute(args, ctx) {
    const fullPath = path.join(args.project_path, args.phase_file)

    if (!fs.existsSync(fullPath)) {
      return JSON.stringify({ error: `Archivo no encontrado: ${args.phase_file}` })
    }

    const content = fs.readFileSync(fullPath, "utf-8")
    const lines = content.split("\n")

    const startIdx = lines.findIndex(l => l.trim() === "---")
    if (startIdx === -1) {
      return JSON.stringify({ error: "No tiene frontmatter YAML" })
    }

    const endIdx = lines.findIndex((l, i) => i > startIdx && l.trim() === "---")
    if (endIdx === -1) {
      return JSON.stringify({ error: "Frontmatter sin closing ---" })
    }

    // Parse frontmatter
    const yamlLines = lines.slice(startIdx + 1, endIdx)
    const fm: Record<string, any> = {}
    for (const line of yamlLines) {
      const colonIdx = line.indexOf(":")
      if (colonIdx === -1) continue
      const key = line.slice(0, colonIdx).trim()
      const value = line.slice(colonIdx + 1).trim()

      if (value.startsWith("[") && value.endsWith("]")) {
        fm[key] = value.slice(1, -1).split(",").map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean)
      } else if (value === "true") {
        fm[key] = true
      } else if (value === "false") {
        fm[key] = false
      } else if (!isNaN(Number(value)) && value !== "") {
        fm[key] = Number(value)
      } else {
        fm[key] = value
      }
    }

    // Build phase JSON from frontmatter
    const phaseId = fm.phase_id || path.basename(args.phase_file, ".md")
    const phasesDir = path.join(args.project_path, ".orquestador", "phases")
    const phasePath = path.join(phasesDir, `${phaseId}.json`)

    if (fs.existsSync(phasePath) && !args.force) {
      return JSON.stringify({
        error: `Ya existe phases/${phaseId}.json. Usá force=true para sobrescribir.`,
        existing: phasePath,
      })
    }

    const phaseJson = {
      id: phaseId,
      type: fm.type || "agent",
      agent: fm.agent || null,
      status: "PENDING",
      retries: 0,
      max_retries: fm.max_retries || 3,
      files_created: [],
      files_modified: [],
      files_failed: [],
      files_skipped: [],
      hash_inputs: fm.hash_inputs || [],
      exit_check: fm.exit_check || "none",
      exit_files: fm.exit_files || [],
      entry_condition: fm.entry_condition || null,
      supports_partial_retry: fm.supports_partial_retry ?? false,
      error: null,
      started_at: null,
      completed_at: null,
      created_at: new Date().toISOString(),
    }

    // Ensure phases dir exists
    if (!fs.existsSync(phasesDir)) {
      fs.mkdirSync(phasesDir, { recursive: true })
    }

    fs.writeFileSync(phasePath, JSON.stringify(phaseJson, null, 2), "utf-8")

    return JSON.stringify({
      created: phasePath,
      phase_id: phaseId,
      phase_json: phaseJson,
      summary: `Creado phases/${phaseId}.json (type=${phaseJson.type}, agent=${phaseJson.agent || "none"})`,
    }, null, 2)
  },
})
