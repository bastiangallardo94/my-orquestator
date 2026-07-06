import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"
import { execSync } from "child_process"

export default tool({
  description: "Crea un commit git anotado en cada checkpoint aprobado. Registra quién validó, timestamp, y el estado del pipeline en ese momento.",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    checkpoint_name: tool.schema.string().describe("Nombre del checkpoint (ej: checkpoint_1, checkpoint_maps, checkpoint_review)"),
    approved: tool.schema.boolean().describe("true=APPROVED, false=REJECTED"),
    notes: tool.schema.string().optional().describe("Notas del validador (ej: 'API surface verificada, 85% coverage')"),
    author_name: tool.schema.string().optional().describe("Nombre del validador (default: git config user.name)"),
    author_email: tool.schema.string().optional().describe("Email del validador (default: git config user.email)")
  },
  async execute(args, ctx) {
    // Get git info
    let authorName = args.author_name
    let authorEmail = args.author_email
    try {
      if (!authorName) authorName = execSync("git config user.name", { cwd: args.project_path, encoding: "utf-8" }).trim()
      if (!authorEmail) authorEmail = execSync("git config user.email", { cwd: args.project_path, encoding: "utf-8" }).trim()
    } catch {}

    // Read current state for the commit message
    const pointerPath = path.join(args.project_path, ".orquestador", "_pointer.json")
    let pipelineInfo = {}
    if (fs.existsSync(pointerPath)) {
      const pointer = JSON.parse(fs.readFileSync(pointerPath, "utf-8"))
      pipelineInfo = {
        flow: pointer.flow,
        impact: pointer.impact,
        change_type: pointer.change_type,
        user_request: pointer.user_request,
        current_phase: pointer.phase_order?.[pointer.current_index],
      }
    }

    const timestamp = new Date().toISOString()
    const status = args.approved ? "APPROVED" : "REJECTED"
    const branch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: args.project_path, encoding: "utf-8" }).trim()
    const commitHash = execSync("git rev-parse HEAD", { cwd: args.project_path, encoding: "utf-8" }).trim()

    // Build commit message
    const notesContent = args.notes
      ? `\n\nNotas del validador:\n${args.notes}`
      : ""

    const commitMessage = `orquestador: ${status} ${args.checkpoint_name}

Pipeline: ${JSON.stringify(pipelineInfo, null, 0)}
Checkpoint: ${args.checkpoint_name}
Status: ${status}
Validated by: ${authorName} <${authorEmail}>
Timestamp: ${timestamp}
Git branch: ${branch}
Git HEAD: ${commitHash}${notesContent}
`.trim()

    // Create an annotated tag (acts as lightweight checkpoint marker)
    const tagName = `${args.checkpoint_name}`
    try {
      // Try creating a tag
      const tagCmd = `git tag -a "${tagName}" -m "${commitMessage}" HEAD`
      execSync(tagCmd, {
        cwd: args.project_path,
        encoding: "utf-8",
        env: {
          ...process.env,
          GIT_AUTHOR_NAME: authorName || "Orquestador",
          GIT_AUTHOR_EMAIL: authorEmail || "orquestador@local",
          GIT_COMMITTER_NAME: authorName || "Orquestador",
          GIT_COMMITTER_EMAIL: authorEmail || "orquestador@local",
        }
      })
    } catch (tagErr: any) {
      // Tag might already exist or we don't have tag permissions — fall back to commit
      try {
        const msgPath = path.join(args.project_path, ".git", `COMMIT_MSG_${Date.now()}`)
        fs.writeFileSync(msgPath, commitMessage)
        execSync(`git commit --allow-empty -F "${msgPath}"`, {
          cwd: args.project_path,
          encoding: "utf-8",
          env: {
            ...process.env,
            GIT_AUTHOR_NAME: authorName || "Orquestador",
            GIT_AUTHOR_EMAIL: authorEmail || "orquestador@local",
            GIT_COMMITTER_NAME: authorName || "Orquestador",
            GIT_COMMITTER_EMAIL: authorEmail || "orquestador@local",
          }
        })
        fs.unlinkSync(msgPath)
      } catch (commitErr: any) {
        return JSON.stringify({
          error: `No pude crear tag ni commit: ${commitErr.message}`,
          hint: "Verificá permisos de git y que el repo está limpio (sin cambios sin commit)",
        })
      }
    }

    // Get the new ref
    let newRef = ""
    try {
      newRef = execSync(`git rev-parse ${tagName}`, { cwd: args.project_path, encoding: "utf-8" }).trim()
    } catch {
      newRef = execSync("git rev-parse HEAD", { cwd: args.project_path, encoding: "utf-8" }).trim()
    }

    return JSON.stringify({
      checkpoint: args.checkpoint_name,
      status,
      tag_created: newRef.length > 0,
      ref: newRef,
      author: `${authorName} <${authorEmail}>`,
      timestamp,
      pipeline_info: pipelineInfo,
      summary: `${status} ${args.checkpoint_name} → ${newRef.slice(0, 8)} (${authorName})`,
    }, null, 2)
  },
})
