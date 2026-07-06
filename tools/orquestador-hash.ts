import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"
import crypto from "crypto"

export default tool({
  description: "Calcula SHA256 de archivos de input para el sistema de cache del orquestador. Compara con hash previo para detectar cambios.",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    files: tool.schema.array(tool.schema.string()).describe("Archivos a hashear (rutas relativas al proyecto)"),
    cache_file: tool.schema.string().optional().describe("Ruta al archivo .hash previo para comparar (opcional)")
  },
  async execute(args) {
    const hash = crypto.createHash("sha256")
    const fileHashes: Record<string, string> = {}
    const missing: string[] = []

    for (const file of args.files) {
      const fullPath = path.join(args.project_path, file)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath)
        const fileHash = crypto.createHash("sha256").update(content).digest("hex")
        fileHashes[file] = fileHash
        hash.update(content)
      } else {
        missing.push(file)
      }
    }

    const combinedHash = hash.digest("hex")

    // Compare with previous cache if provided
    let cacheMatch = false
    let previousHash: string | null = null
    if (args.cache_file) {
      const cachePath = path.join(args.project_path, args.cache_file)
      if (fs.existsSync(cachePath)) {
        previousHash = fs.readFileSync(cachePath, "utf-8").trim()
        cacheMatch = previousHash === combinedHash
      }
    }

    return JSON.stringify({
      combined_hash: combinedHash,
      file_hashes: fileHashes,
      missing,
      cache_match: cacheMatch,
      previous_hash: previousHash,
      summary: missing.length > 0
        ? `HASH: ${Object.keys(fileHashes).length} archivos hasheados, ${missing.length} no encontrados`
        : cacheMatch
          ? `HASH MATCH: Inputs sin cambios desde último cache`
          : `HASH MISS: Inputs cambiaron respecto al cache`
    }, null, 2)
  },
})
