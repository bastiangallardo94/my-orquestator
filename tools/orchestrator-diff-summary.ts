import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"
import { execSync } from "child_process"

export default tool({
  description: "Muestra qué archivos cambiaron (git diff --stat) entre la última fase completada y el estado actual. Solo cuenta archivos relevantes del pipeline.",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    since_phase: tool.schema.string().optional().describe("Fase desde la cual comparar (default: última SUCCESS)"),
    include_untracked: tool.schema.boolean().optional().describe("Incluir archivos nuevos (untracked) (default: true)")
  },
  async execute(args, ctx) {
    const since = args.since_phase

    let fromRef = "HEAD"
    if (since) {
      // Use phase commit if exists
      fromRef = `checkpoint_${since}`
    } else {
      // Find last SUCCESS phase commit
      const phasesDir = path.join(args.project_path, ".orquestador", "phases")
      if (fs.existsSync(phasesDir)) {
        const files = fs.readdirSync(phasesDir).filter(f => f.endsWith(".json")).sort()
        for (let i = files.length - 1; i >= 0; i--) {
          const data = JSON.parse(fs.readFileSync(path.join(phasesDir, files[i]), "utf-8"))
          if (data.status === "SUCCESS" && data.completed_at) {
            fromRef = `checkpoint_${data.id}`
            break
          }
        }
      }
    }

    try {
      // Get diff stats
      let diffCmd = `git diff --stat ${fromRef} HEAD 2>/dev/null || echo "no-commits"`
      const diffStat = execSync(diffCmd, { cwd: args.project_path, encoding: "utf-8" })

      // Get changed files list
      let filesCmd = `git diff --name-only ${fromRef} HEAD 2>/dev/null || echo ""`
      const changedFiles = execSync(filesCmd, { cwd: args.project_path, encoding: "utf-8" })
        .split("\n")
        .filter(f => f.trim())

      // Get untracked if requested
      let untracked: string[] = []
      if (args.include_untracked !== false) {
        try {
          const utCmd = `git ls-files --others --exclude-standard`
          untracked = execSync(utCmd, { cwd: args.project_path, encoding: "utf-8" })
            .split("\n")
            .filter(f => f.trim())
        } catch {}
      }

      // Classify changes
      const classified = {
        specs: changedFiles.filter(f => f.includes("spec") || f.includes("test") || f.includes("openapi") || f.includes("changelog")),
        source: changedFiles.filter(f => f.endsWith(".ts") || f.endsWith(".tsx") || f.endsWith(".js") || f.endsWith(".jsx")),
        config: changedFiles.filter(f => f.endsWith(".json") || f.endsWith(".yaml") || f.endsWith(".yml") || f === "Makefile" || f === "Dockerfile"),
        docs: changedFiles.filter(f => f.endsWith(".md") || f.endsWith(".txt") || f.endsWith(".adoc")),
        infra: changedFiles.filter(f => f.includes("docker") || f.includes("k8s") || f.includes("terraform") || f.includes(".github")),
        other: changedFiles.filter(f => !["specs", "source", "config", "docs", "infra"].some(c => c.includes(f))),
      }

      const summary = `+${diffStat.split("\n").filter(l => l.includes("+")).length} / -${diffStat.split("\n").filter(l => l.includes("-")).length}`

      return JSON.stringify({
        from_ref: fromRef,
        to_ref: "HEAD",
        total_changed: changedFiles.length,
        total_untracked: untracked.length,
        diff_stat: diffStat.trim() || "(sin cambios)",
        changed_files: changedFiles,
        untracked_files: untracked,
        classified,
        summary: `${changedFiles.length} archivos cambiados, ${untracked.length} nuevos. ${summary}`,
      }, null, 2)
    } catch (err: any) {
      return JSON.stringify({
        error: `Git error: ${err.message}`,
        hint: "Asegurate de estar en un repo git y tener commits previos",
      })
    }
  },
})
