import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"

export default tool({
  description: "Lee el estado actual del pipeline orquestador desde .orquestador/_pointer.json y devuelve un resumen formateado",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto (working directory)")
  },
  async execute(args) {
    const pointerPath = path.join(args.project_path, ".orquestador", "_pointer.json")

    if (!fs.existsSync(pointerPath)) {
      return JSON.stringify({ error: "No hay pipeline activo. .orquestador/_pointer.json no existe." })
    }

    try {
      const pointer = JSON.parse(fs.readFileSync(pointerPath, "utf-8"))
      const currentPhase = pointer.phase_order?.[pointer.current_index] || "NINGUNA"
      const totalPhases = pointer.phase_order?.length || 0
      const progress = totalPhases > 0 ? Math.round((pointer.current_index / totalPhases) * 100) : 0

      // Read current phase status
      let currentPhaseStatus = "N/A"
      const phasePath = path.join(args.project_path, ".orquestador", "phases", `${currentPhase}.json`)
      if (fs.existsSync(phasePath)) {
        const phaseData = JSON.parse(fs.readFileSync(phasePath, "utf-8"))
        currentPhaseStatus = phaseData.status || "UNKNOWN"
      }

      // Read all phases summary
      const phasesDir = path.join(args.project_path, ".orquestador", "phases")
      const phaseStatuses: Record<string, string> = {}
      if (fs.existsSync(phasesDir)) {
        const files = fs.readdirSync(phasesDir).filter(f => f.endsWith(".json"))
        for (const file of files) {
          const data = JSON.parse(fs.readFileSync(path.join(phasesDir, file), "utf-8"))
          phaseStatuses[data.id || file.replace(".json", "")] = data.status || "UNKNOWN"
        }
      }

      return JSON.stringify({
        flow: pointer.flow,
        impact: pointer.impact,
        change_type: pointer.change_type,
        user_request: pointer.user_request?.substring(0, 100),
        current_phase: currentPhase,
        current_phase_status: currentPhaseStatus,
        progress: `${pointer.current_index}/${totalPhases} (${progress}%)`,
        mcp_available: pointer.mcp_available,
        codebase_project: pointer.codebase_project,
        deep_model: pointer.deep_model,
        phases: phaseStatuses
      }, null, 2)
    } catch (err) {
      return JSON.stringify({ error: `Error leyendo estado: ${err}` })
    }
  },
})
