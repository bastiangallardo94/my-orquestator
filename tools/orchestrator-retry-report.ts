import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"

export default tool({
  description: "Genera el bloque MODO RETRY para anteponer al prompt de un agente, leyendo files_failed y error de phases/<id>.json.",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    phase_id: tool.schema.string().describe("ID de la fase en retry (ej: phase_3_coding)")
  },
  async execute(args, ctx) {
    const phasePath = path.join(args.project_path, ".orquestador", "phases", `${args.phase_id}.json`)

    if (!fs.existsSync(phasePath)) {
      return JSON.stringify({ error: `No existe phases/${args.phase_id}.json` })
    }

    const phase = JSON.parse(fs.readFileSync(phasePath, "utf-8"))
    const files_failed = phase.files_failed || []
    const files_skipped = phase.files_skipped || []
    const error = phase.error || "Error desconocido"
    const retryCount = (phase.retries || 0) + 1
    const maxRetries = phase.max_retries || 3

    if (phase.status !== "FAILED" && phase.status !== "PARTIAL") {
      return JSON.stringify({
        warning: `Fase no está en estado FAILED/PARTIAL (estado actual: ${phase.status}). No hay retry activo.`,
        phase_id: args.phase_id,
        status: phase.status,
      })
    }

    const block = `
## 🔁 MODO RETRY — Intento ${retryCount}/${maxRetries}

### Error anterior
\`\`\`
${error}
\`\`\`

### Archivos que fallaron (no modificar — investigar causa raíz)
${files_failed.length > 0 ? files_failed.map(f => `- ${f}`).join("\n") : "- (ninguno registrado)"}

### Archivos omitidos
${files_skipped.length > 0 ? files_skipped.map(f => `- ${f}`).join("\n") : "- (ninguno)"}

### Instrucciones
1. **No re-intentes los mismos comandos** que causaron el error anterior
2. **Investiga la causa raíz** del fallo antes de actuar
3. **Corrige el approach**, no el síntoma
4. Si el error es de compilación → revierte cambios recientes en los archivos affected
5. Si el error es de tests → revisa el mensaje de error y corrige el código, no los tests
6. **Reporta el error exacto** en la propiedad "error" al terminar

### Causas raíz comunes de retry
- Error de compilación TypeScript: typo, import faltante, tipo incorrecto
- Test quebrado: mock mal configurado, assertion incorrecta
- Dependencia no resuelta: archivo de entrada faltante
- Permiso denegado: archivo lockeado o readonly
`.trim()

    return JSON.stringify({
      retry_block: block,
      retry_count: retryCount,
      max_retries: maxRetries,
      files_failed,
      error,
      summary: `RETRY ${retryCount}/${maxRetries}: ${files_failed.length} archivos fallidos, ${files_skipped.length} omitidos`,
    }, null, 2)
  },
})
