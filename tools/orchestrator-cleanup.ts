import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"
import { execSync } from "child_process"

export default tool({
  description: "Archiva el pipeline actual a .orquestador/history/{timestamp}/. Limpia cache, resetea estado. Mantiene los phases/*.json originales.",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    dry_run: tool.schema.boolean().optional().describe("Solo mostrar qué se archivaría (default: false)")
  },
  async execute(args, ctx) {
    const orquestadorDir = path.join(args.project_path, ".orquestador")

    if (!fs.existsSync(orquestadorDir)) {
      return JSON.stringify({ error: "No existe .orquestador/" })
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const historyDir = path.join(orquestadorDir, "history", timestamp)

    if (args.dry_run ?? false) {
      // Just list what would be archived
      const subdirs = fs.existsSync(historyDir)
        ? fs.readdirSync(historyDir)
        : ["cache/", "phases/", "_pointer.json", "summary.md", "context.md", "dependency-groups.json", "api-surface.md"]

      return JSON.stringify({
        dry_run: true,
        would_archive_to: historyDir,
        would_archive: subdirs,
        summary: `DRY RUN: Se archivarían ${subdirs.length} elementos a ${historyDir}`,
      })
    }

    // Create history dir preserving structure
    fs.mkdirSync(path.join(historyDir, "cache"), { recursive: true })
    fs.mkdirSync(path.join(historyDir, "phases"), { recursive: true })

    const toArchive = [
      { src: "_pointer.json", dst: "_pointer.json" },
      { src: "summary.md", dst: "summary.md" },
      { src: "context.md", dst: "context.md" },
      { src: "dependency-groups.json", dst: "dependency-groups.json" },
      { src: "api-surface.md", dst: "api-surface.md" },
    ]

    const archived: string[] = []
    const failed: string[] = []

    for (const item of toArchive) {
      const src = path.join(orquestadorDir, item.src)
      const dst = path.join(historyDir, item.dst)
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dst)
        archived.push(item.src)
      }
    }

    // Archive phases individually
    const phasesDir = path.join(orquestadorDir, "phases")
    if (fs.existsSync(phasesDir)) {
      for (const f of fs.readdirSync(phasesDir).filter(f => f.endsWith(".json"))) {
        const src = path.join(phasesDir, f)
        const dst = path.join(historyDir, "phases", f)
        fs.copyFileSync(src, dst)
        archived.push(`phases/${f}`)
      }
    }

    // Archive cache hashes
    const cacheDir = path.join(orquestadorDir, "cache")
    if (fs.existsSync(cacheDir)) {
      for (const f of fs.readdirSync(cacheDir).filter(f => f.endsWith(".hash") || f.endsWith(".json"))) {
        const src = path.join(cacheDir, f)
        const dst = path.join(historyDir, "cache", f)
        fs.copyFileSync(src, dst)
        archived.push(`cache/${f}`)
      }
    }

    // Clean up cache
    if (fs.existsSync(cacheDir)) {
      for (const f of fs.readdirSync(cacheDir)) {
        fs.unlinkSync(path.join(cacheDir, f))
      }
    }

    // Optionally: git add history (if in a git repo)
    let gitArchived = false
    try {
      execSync(`git add "${historyDir}"`, { cwd: args.project_path, stdio: "ignore" })
      gitArchived = true
    } catch {}

    return JSON.stringify({
      archived_to: historyDir,
      files_archived: archived.length,
      git_added: gitArchived,
      summary: `Archivado ${archived.length} elementos a history/${timestamp}/`,
    }, null, 2)
  },
})
