import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"

export default tool({
  description: "Verifica que los archivos de salida de una fase del orquestador existen en disco. Devuelve found/missing.",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    phase_id: tool.schema.string().describe("ID de la fase (ej: phase_2_backend)"),
    exit_files: tool.schema.array(tool.schema.string()).describe("Lista de archivos a verificar (rutas relativas al proyecto)")
  },
  async execute(args) {
    const found: string[] = []
    const missing: string[] = []

    for (const file of args.exit_files) {
      const fullPath = path.join(args.project_path, file)
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath)
        found.push(`${file} (${stats.size} bytes)`)
      } else {
        missing.push(file)
      }
    }

    const allFound = missing.length === 0

    return JSON.stringify({
      phase_id: args.phase_id,
      exit_check_passed: allFound,
      found,
      missing,
      summary: allFound
        ? `EXIT CHECK PASS: Todos los ${found.length} archivos existen`
        : `EXIT CHECK FAIL: ${missing.length} archivos faltantes de ${args.exit_files.length}`
    }, null, 2)
  },
})
