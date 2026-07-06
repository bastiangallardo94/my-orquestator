import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"

export default tool({
  description: "Lee todos los archivos phases/*.json y genera un summary formateado del pipeline. Calcula duración, retries y status de cada fase.",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    verbose: tool.schema.boolean().optional().describe("Incluir archivos created/modified por fase (default: false)")
  },
  async execute(args, ctx) {
    const phasesDir = path.join(args.project_path, ".orquestador", "phases")

    if (!fs.existsSync(phasesDir)) {
      return JSON.stringify({ error: "No existe .orquestador/phases/" })
    }

    const files = fs.readdirSync(phasesDir).filter(f => f.endsWith(".json")).sort()
    if (files.length === 0) {
      return JSON.stringify({ error: "No hay fases registradas" })
    }

    const phases: Record<string, any> = {}
    const summary = {
      total: files.length,
      SUCCESS: 0,
      FAILED: 0,
      IN_PROGRESS: 0,
      PENDING: 0,
      SKIPPED: 0,
      PARTIAL: 0,
    }

    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(phasesDir, file), "utf-8"))
      const id = data.id || file.replace(".json", "")
      phases[id] = {
        status: data.status || "UNKNOWN",
        type: data.type,
        agent: data.agent,
        retries: data.retries || 0,
        max_retries: data.max_retries || 3,
        started_at: data.started_at,
        completed_at: data.completed_at,
        error: data.error || null,
      }
      if (data.status in summary) summary[data.status as keyof typeof summary]++
    }

    // Read pointer for current phase
    const pointerPath = path.join(args.project_path, ".orquestador", "_pointer.json")
    let currentPhase = "NINGUNA"
    let currentIndex = 0
    if (fs.existsSync(pointerPath)) {
      const pointer = JSON.parse(fs.readFileSync(pointerPath, "utf-8"))
      currentIndex = pointer.current_index || 0
      currentPhase = pointer.phase_order?.[currentIndex] || "NINGUNA"
    }

    // Calculate durations
    const durations: Record<string, string> = {}
    for (const [id, p] of Object.entries(phases)) {
      const phase = p as any
      if (phase.started_at && phase.completed_at) {
        const ms = new Date(phase.completed_at).getTime() - new Date(phase.started_at).getTime()
        const mins = Math.floor(ms / 60000)
        const secs = Math.floor((ms % 60000) / 1000)
        durations[id] = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
      }
    }

    // Build markdown-like table
    const tableRows = Object.entries(phases).map(([id, p]) => {
      const phase = p as any
      const marker = id === currentPhase ? "👉" : "  "
      const statusIcon = phase.status === "SUCCESS" ? "✅" :
                         phase.status === "FAILED" ? "❌" :
                         phase.status === "IN_PROGRESS" ? "🔄" :
                         phase.status === "PARTIAL" ? "⚠️" : "⏳"
      const duration = durations[id] || "-"
      return `${marker} ${statusIcon} ${id.padEnd(28)} ${phase.status.padEnd(12)} ${duration.padEnd(8)} retries: ${phase.retries}/${phase.max_retries}`
    })

    const result = {
      summary: {
        ...summary,
        progress: `${currentIndex}/${files.length}`,
        current_phase: currentPhase,
      },
      phases,
      durations,
      table: tableRows.join("\n"),
    }

    return JSON.stringify(result, null, 2)
  },
})
