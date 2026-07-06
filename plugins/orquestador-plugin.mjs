import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"
import crypto from "crypto"
import { execSync } from "child_process"

// --- Tool: orquestador-state ---
const orquestadorState = tool({
  description: "Lee el estado actual del pipeline orquestador desde .orquestador/_pointer.json",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
  },
  async execute(args) {
    const pointerPath = path.join(args.project_path, ".orquestador", "_pointer.json")
    if (!fs.existsSync(pointerPath)) {
      return JSON.stringify({ error: "No hay pipeline activo" })
    }
    try {
      const pointer = JSON.parse(fs.readFileSync(pointerPath, "utf-8"))
      const currentPhase = pointer.phase_order?.[pointer.current_index] || "NINGUNA"
      const totalPhases = pointer.phase_order?.length || 0
      const progress = totalPhases > 0 ? Math.round((pointer.current_index / totalPhases) * 100) : 0
      const phaseStatuses: Record<string, string> = {}
      const phasesDir = path.join(args.project_path, ".orquestador", "phases")
      if (fs.existsSync(phasesDir)) {
        for (const file of fs.readdirSync(phasesDir).filter(f => f.endsWith(".json"))) {
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
        progress: `${pointer.current_index}/${totalPhases} (${progress}%)`,
        mcp_available: pointer.mcp_available,
        phases: phaseStatuses,
      }, null, 2)
    } catch (err) {
      return JSON.stringify({ error: `Error: ${err}` })
    }
  },
})

// --- Tool: orquestador-verify ---
const orquestadorVerify = tool({
  description: "Verifica que los archivos de salida de una fase existen en disco",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    phase_id: tool.schema.string().describe("ID de la fase"),
    exit_files: tool.schema.array(tool.schema.string()).describe("Archivos a verificar"),
  },
  async execute(args) {
    const found: string[] = []
    const missing: string[] = []
    for (const file of args.exit_files) {
      const fullPath = path.join(args.project_path, file)
      if (fs.existsSync(fullPath)) {
        found.push(`${file} (${fs.statSync(fullPath).size} bytes)`)
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
      summary: allFound ? `EXIT CHECK PASS: ${found.length} archivos` : `EXIT CHECK FAIL: ${missing.length} faltantes`,
    }, null, 2)
  },
})

// --- Tool: orquestador-hash ---
const orquestadorHash = tool({
  description: "Calcula SHA256 de archivos para cache del orquestador",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    files: tool.schema.array(tool.schema.string()).describe("Archivos a hashear"),
    cache_file: tool.schema.string().optional().describe("Archivo .hash previo para comparar"),
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
      summary: missing.length > 0 ? `HASH: ${Object.keys(fileHashes).length} archivos` : cacheMatch ? "HASH MATCH" : "HASH MISS",
    }, null, 2)
  },
})

// --- Tool: orchestrator-summary ---
const orchestratorSummary = tool({
  description: "Lee todos phases/*.json y genera summary formateado del pipeline",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    verbose: tool.schema.boolean().optional(),
  },
  async execute(args) {
    const phasesDir = path.join(args.project_path, ".orquestador", "phases")
    if (!fs.existsSync(phasesDir)) {
      return JSON.stringify({ error: "No existe .orquestador/phases/" })
    }
    const files = fs.readdirSync(phasesDir).filter(f => f.endsWith(".json")).sort()
    const phases: Record<string, any> = {}
    const summary = { total: files.length, SUCCESS: 0, FAILED: 0, IN_PROGRESS: 0, PENDING: 0, SKIPPED: 0, PARTIAL: 0 }
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(phasesDir, file), "utf-8"))
      const id = data.id || file.replace(".json", "")
      phases[id] = { status: data.status, type: data.type, agent: data.agent, retries: data.retries || 0, max_retries: data.max_retries || 3, started_at: data.started_at, completed_at: data.completed_at }
      if (data.status in summary) summary[data.status as keyof typeof summary]++
    }
    const pointerPath = path.join(args.project_path, ".orquestador", "_pointer.json")
    let currentPhase = "NINGUNA"
    if (fs.existsSync(pointerPath)) {
      const pointer = JSON.parse(fs.readFileSync(pointerPath, "utf-8"))
      currentPhase = pointer.phase_order?.[pointer.current_index] || "NINGUNA"
    }
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
    const tableRows = Object.entries(phases).map(([id, p]) => {
      const phase = p as any
      const marker = id === currentPhase ? "👉" : "  "
      const statusIcon = phase.status === "SUCCESS" ? "✅" : phase.status === "FAILED" ? "❌" : phase.status === "IN_PROGRESS" ? "🔄" : phase.status === "PARTIAL" ? "⚠️" : "⏳"
      const duration = durations[id] || "-"
      return `${marker} ${statusIcon} ${id.padEnd(28)} ${(phase.status || "?").padEnd(12)} ${duration.padEnd(8)} retries: ${phase.retries}/${phase.max_retries}`
    })
    return JSON.stringify({ summary: { ...summary, progress: `${currentPhase}`, current_phase: currentPhase }, phases, durations, table: tableRows.join("\n") }, null, 2)
  },
})

// --- Tool: orchestrator-frontmatter ---
const orchestratorFrontmatter = tool({
  description: "Parsea SOLO el frontmatter YAML de un .md sin leer el body",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    file_path: tool.schema.string().describe("Ruta relativa al archivo .md"),
  },
  async execute(args) {
    const fullPath = path.join(args.project_path, args.file_path)
    if (!fs.existsSync(fullPath)) return JSON.stringify({ error: "Archivo no encontrado" })
    const lines = fs.readFileSync(fullPath, "utf-8").split("\n")
    const startIdx = lines.findIndex(l => l.trim() === "---")
    if (startIdx === -1) return JSON.stringify({ error: "No tiene frontmatter" })
    const endIdx = lines.findIndex((l, i) => i > startIdx && l.trim() === "---")
    if (endIdx === -1) return JSON.stringify({ error: "Frontmatter sin closing ---" })
    const parsed: Record<string, any> = {}
    for (const line of lines.slice(startIdx + 1, endIdx)) {
      const colonIdx = line.indexOf(":")
      if (colonIdx === -1) continue
      const key = line.slice(0, colonIdx).trim()
      const value = line.slice(colonIdx + 1).trim()
      if (value.startsWith("[") && value.endsWith("]")) {
        parsed[key] = value.slice(1, -1).split(",").map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean)
      } else if (value === "true") parsed[key] = true
      else if (value === "false") parsed[key] = false
      else if (!isNaN(Number(value)) && value !== "") parsed[key] = Number(value)
      else parsed[key] = value
    }
    return JSON.stringify({ file: args.file_path, frontmatter: parsed, summary: `phase_id=${parsed.phase_id || "N/A"} type=${parsed.type || "N/A"} agent=${parsed.agent || "N/A"}` }, null, 2)
  },
})

// --- Tool: orchestrator-entry-check ---
const orchestratorEntryCheck = tool({
  description: "Evalúa entry_condition contra el filesystem (AND, OR, negación)",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    entry_condition: tool.schema.string().describe("Condición a evaluar"),
    condition_type: tool.schema.enum(["entry_condition", "glob", "file"]).optional(),
  },
  async execute(args) {
    function fileExists(rel) { return fs.existsSync(path.join(args.project_path, rel)) }
    function dirExists(rel) { try { return fs.statSync(path.join(args.project_path, rel)).isDirectory() } catch { return false } }
    function evaluate(expr) {
      expr = expr.trim()
      if (expr.startsWith("!")) return !evaluate(expr.slice(1))
      const andParts = expr.split("&&").map(s => s.trim())
      if (andParts.length > 1) return andParts.every(p => evaluate(p))
      const orParts = expr.split("||").map(s => s.trim())
      if (orParts.length > 1) return orParts.some(p => evaluate(p))
      const norm = expr.replace(/debe existir|must exist|should exist|está presente|is present/gi, "").trim()
      if (norm.endsWith("/")) return dirExists(norm)
      return fileExists(norm)
    }
    try {
      const passed = evaluate(args.entry_condition)
      return JSON.stringify({ passed, condition: args.entry_condition, evaluated: passed ? "PASS" : "FAIL", summary: passed ? `ENTRY CHECK PASS` : `ENTRY CHECK FAIL` }, null, 2)
    } catch (err) {
      return JSON.stringify({ passed: false, error: `${err}`, condition: args.entry_condition })
    }
  },
})

// --- Tool: orchestrator-retry-report ---
const orchestratorRetryReport = tool({
  description: "Genera el bloque MODO RETRY desde phases/<id>.json",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    phase_id: tool.schema.string().describe("ID de la fase en retry"),
  },
  async execute(args) {
    const phasePath = path.join(args.project_path, ".orquestador", "phases", `${args.phase_id}.json`)
    if (!fs.existsSync(phasePath)) return JSON.stringify({ error: `No existe phases/${args.phase_id}.json` })
    const phase = JSON.parse(fs.readFileSync(phasePath, "utf-8"))
    const files_failed = phase.files_failed || []
    const files_skipped = phase.files_skipped || []
    const error = phase.error || "Error desconocido"
    const retryCount = (phase.retries || 0) + 1
    const maxRetries = phase.max_retries || 3
    if (phase.status !== "FAILED" && phase.status !== "PARTIAL") {
      return JSON.stringify({ warning: `Fase no está en FAILED/PARTIAL (${phase.status})`, phase_id: args.phase_id, status: phase.status })
    }
    const block = `\n## 🔁 MODO RETRY — Intento ${retryCount}/${maxRetries}\n\n### Error anterior\n\`\`\`\n${error}\n\`\`\`\n\n### Archivos que fallaron\n${files_failed.length > 0 ? files_failed.map(f => `- ${f}`).join("\n") : "- (ninguno)"}\n\n### Archivos omitidos\n${files_skipped.length > 0 ? files_skipped.map(f => `- ${f}`).join("\n") : "- (ninguno)"}\n\n### Instrucciones\n1. No re-intentes los mismos comandos que causaron el error\n2. Investiga la causa raíz antes de actuar\n3. Corrige el approach, no el síntoma\n`.trim()
    return JSON.stringify({ retry_block: block, retry_count: retryCount, max_retries: maxRetries, files_failed, error, summary: `RETRY ${retryCount}/${maxRetries}: ${files_failed.length} archivos fallidos` }, null, 2)
  },
})

// --- Tool: orchestrator-diff-summary ---
const orchestratorDiffSummary = tool({
  description: "Muestra archivos cambiados (git diff) desde la última fase",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    since_phase: tool.schema.string().optional(),
    include_untracked: tool.schema.boolean().optional(),
  },
  async execute(args) {
    let fromRef = "HEAD"
    if (args.since_phase) {
      fromRef = `checkpoint_${args.since_phase}`
    } else {
      const phasesDir = path.join(args.project_path, ".orquestador", "phases")
      if (fs.existsSync(phasesDir)) {
        for (const file of fs.readdirSync(phasesDir).filter(f => f.endsWith(".json")).sort().reverse()) {
          const data = JSON.parse(fs.readFileSync(path.join(phasesDir, file), "utf-8"))
          if (data.status === "SUCCESS" && data.completed_at) { fromRef = `checkpoint_${data.id}`; break }
        }
      }
    }
    try {
      const diffStat = execSync(`git diff --stat ${fromRef} HEAD 2>/dev/null || echo ""`, { cwd: args.project_path, encoding: "utf-8" })
      const changedFiles = execSync(`git diff --name-only ${fromRef} HEAD 2>/dev/null || echo ""`, { cwd: args.project_path, encoding: "utf-8" }).split("\n").filter(f => f.trim())
      let untracked: string[] = []
      if (args.include_untracked !== false) {
        try { untracked = execSync(`git ls-files --others --exclude-standard`, { cwd: args.project_path, encoding: "utf-8" }).split("\n").filter(f => f.trim()) } catch {}
      }
      return JSON.stringify({ from_ref: fromRef, to_ref: "HEAD", total_changed: changedFiles.length, total_untracked: untracked.length, changed_files: changedFiles, untracked_files: untracked, summary: `${changedFiles.length} archivos cambiados, ${untracked.length} nuevos` }, null, 2)
    } catch (err: any) {
      return JSON.stringify({ error: `Git error: ${err.message}` })
    }
  },
})

// --- Tool: orchestrator-dependency-groups ---
const orchestratorDependencyGroups = tool({
  description: "Lee dependency-groups.json y retorna grupos de paralelización",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
  },
  async execute(args) {
    const dgPath = path.join(args.project_path, ".orquestador", "dependency-groups.json")
    if (!fs.existsSync(dgPath)) return JSON.stringify({ error: "No existe dependency-groups.json. Ejecutá phase_2_8 primero." })
    const dg = JSON.parse(fs.readFileSync(dgPath, "utf-8"))
    if (!dg.groups || !Array.isArray(dg.groups)) return JSON.stringify({ error: "Formato inválido: falta groups[]" })
    const groups = dg.groups.map((g: any, i: number) => ({ group_id: i + 1, files: g.files || [], can_parallel: dg.parallel_within_group && (g.files?.length > 1) }))
    const table = groups.map(g => `[Grupo ${g.group_id}] ${g.can_parallel ? "Parallel" : "Seq     "} → ${g.files.join(", ")}`).join("\n")
    return JSON.stringify({ groups, parallel_within_group: dg.parallel_within_group ?? true, total_files: groups.reduce((acc: number, g: any) => acc + g.files.length, 0), group_count: groups.length, table, summary: `${groups.length} grupos. Paralelismo: ${dg.parallel_within_group ? "ON" : "OFF"}` }, null, 2)
  },
})

// --- Tool: orchestrator-context-update ---
const orchestratorContextUpdate = tool({
  description: "Merge inteligente de context.md sin duplicar contenido",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    new_content: tool.schema.string().describe("Contenido nuevo a agregar"),
    section: tool.schema.string().optional(),
    dry_run: tool.schema.boolean().optional(),
  },
  async execute(args) {
    const ctxPath = path.join(args.project_path, ".orquestador", "context.md")
    const existing = fs.existsSync(ctxPath) ? fs.readFileSync(ctxPath, "utf-8") : ""
    const newLines = args.new_content.split("\n").filter(l => l.trim())
    const existingLines = existing.split("\n").filter(l => l.trim())
    const dupSet = new Set<string>()
    for (const nl of newLines) {
      const norm = nl.toLowerCase().trim()
      for (const el of existingLines) {
        if (el.toLowerCase().trim() === norm || (norm.length > 10 && el.toLowerCase().includes(norm))) { dupSet.add(nl); break }
      }
    }
    const unique = newLines.filter(l => !dupSet.has(l))
    if (unique.length === 0) return JSON.stringify({ skipped: newLines.length, added: 0, summary: "Todo ya existe — no se agregó nada" })
    let output: string
    if (args.section) {
      const secPat = new RegExp(`^##\\s+${args.section}\\s*$`, "i")
      const secIdx = existing.split("\n").findIndex(l => secPat.test(l.trim()))
      if (secIdx !== -1) { const lines = existing.split("\n"); lines.splice(secIdx + 1, 0, "", ...unique); output = lines.join("\n") }
      else output = existing + `\n\n## ${args.section}\n` + unique.join("\n")
    } else {
      output = existing + `\n\n## Update ${new Date().toISOString().split("T")[0]}\n` + unique.join("\n")
    }
    if (args.dry_run) return JSON.stringify({ dry_run: true, skipped_duplicates: dupSet.size, would_add: unique, summary: `DRY RUN: ${unique.length} líneas nuevas (${dupSet.size} duplicados)` })
    fs.writeFileSync(ctxPath, output, "utf-8")
    return JSON.stringify({ skipped_duplicates: dupSet.size, added: unique.length, total_lines_after: existingLines.length + unique.length, summary: `${unique.length} líneas agregadas, ${dupSet.size} duplicados omitidos` }, null, 2)
  },
})

// --- Tool: orchestrator-phase-template ---
const orchestratorPhaseTemplate = tool({
  description: "Crea phases/<id>.json desde el frontmatter YAML de un prompt .md",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    phase_file: tool.schema.string().describe("Ruta al .md con frontmatter"),
    force: tool.schema.boolean().optional(),
  },
  async execute(args) {
    const fullPath = path.join(args.project_path, args.phase_file)
    if (!fs.existsSync(fullPath)) return JSON.stringify({ error: "Archivo no encontrado" })
    const lines = fs.readFileSync(fullPath, "utf-8").split("\n")
    const sIdx = lines.findIndex(l => l.trim() === "---")
    if (sIdx === -1) return JSON.stringify({ error: "No tiene frontmatter" })
    const eIdx = lines.findIndex((l, i) => i > sIdx && l.trim() === "---")
    if (eIdx === -1) return JSON.stringify({ error: "Frontmatter sin closing ---" })
    const fm: Record<string, any> = {}
    for (const line of lines.slice(sIdx + 1, eIdx)) {
      const c = line.indexOf(":")
      if (c === -1) continue
      const k = line.slice(0, c).trim()
      const v = line.slice(c + 1).trim()
      if (v.startsWith("[") && v.endsWith("]")) fm[k] = v.slice(1, -1).split(",").map((s: string) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean)
      else if (v === "true") fm[k] = true
      else if (v === "false") fm[k] = false
      else if (!isNaN(Number(v)) && v !== "") fm[k] = Number(v)
      else fm[k] = v
    }
    const phaseId = fm.phase_id || path.basename(args.phase_file, ".md")
    const phasesDir = path.join(args.project_path, ".orquestador", "phases")
    const phasePath = path.join(phasesDir, `${phaseId}.json`)
    if (fs.existsSync(phasePath) && !args.force) return JSON.stringify({ error: `Ya existe phases/${phaseId}.json. Usá force=true.` })
    const phaseJson = { id: phaseId, type: fm.type || "agent", agent: fm.agent || null, status: "PENDING", retries: 0, max_retries: fm.max_retries || 3, files_created: [], files_modified: [], files_failed: [], files_skipped: [], hash_inputs: fm.hash_inputs || [], exit_check: fm.exit_check || "none", exit_files: fm.exit_files || [], entry_condition: fm.entry_condition || null, supports_partial_retry: fm.supports_partial_retry ?? false, error: null, started_at: null, completed_at: null, created_at: new Date().toISOString() }
    if (!fs.existsSync(phasesDir)) fs.mkdirSync(phasesDir, { recursive: true })
    fs.writeFileSync(phasePath, JSON.stringify(phaseJson, null, 2), "utf-8")
    return JSON.stringify({ created: phasePath, phase_id: phaseId, summary: `Creado phases/${phaseId}.json (type=${phaseJson.type})` }, null, 2)
  },
})

// --- Tool: orchestrator-cleanup ---
const orchestratorCleanup = tool({
  description: "Archiva pipeline actual a .orquestador/history/{timestamp}/ y limpia cache",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    dry_run: tool.schema.boolean().optional(),
  },
  async execute(args) {
    const orquestadorDir = path.join(args.project_path, ".orquestador")
    if (!fs.existsSync(orquestadorDir)) return JSON.stringify({ error: "No existe .orquestador/" })
    const ts = new Date().toISOString().replace(/[:.]/g, "-")
    const historyDir = path.join(orquestadorDir, "history", ts)
    if (args.dry_run) return JSON.stringify({ dry_run: true, would_archive_to: historyDir, summary: `DRY RUN: Se archivarían archivos a history/${ts}/` })
    fs.mkdirSync(path.join(historyDir, "cache"), { recursive: true })
    fs.mkdirSync(path.join(historyDir, "phases"), { recursive: true })
    const toArchive = [{ src: "_pointer.json", dst: "_pointer.json" }, { src: "summary.md", dst: "summary.md" }, { src: "context.md", dst: "context.md" }, { src: "dependency-groups.json", dst: "dependency-groups.json" }, { src: "api-surface.md", dst: "api-surface.md" }]
    const archived: string[] = []
    for (const item of toArchive) {
      const src = path.join(orquestadorDir, item.src)
      if (fs.existsSync(src)) { fs.copyFileSync(src, path.join(historyDir, item.dst)); archived.push(item.src) }
    }
    const phasesDir = path.join(orquestadorDir, "phases")
    if (fs.existsSync(phasesDir)) {
      for (const f of fs.readdirSync(phasesDir).filter(f => f.endsWith(".json"))) {
        fs.copyFileSync(path.join(phasesDir, f), path.join(historyDir, "phases", f))
        archived.push(`phases/${f}`)
      }
    }
    const cacheDir = path.join(orquestadorDir, "cache")
    if (fs.existsSync(cacheDir)) {
      for (const f of fs.readdirSync(cacheDir).filter(f => f.endsWith(".hash") || f.endsWith(".json"))) {
        fs.copyFileSync(path.join(cacheDir, f), path.join(historyDir, "cache", f))
        archived.push(`cache/${f}`)
        fs.unlinkSync(path.join(cacheDir, f))
      }
    }
    return JSON.stringify({ archived_to: historyDir, files_archived: archived.length, summary: `Archivado ${archived.length} elementos a history/${ts}/` }, null, 2)
  },
})

// --- Tool: orchestrator-git-checkpoint ---
const orchestratorGitCheckpoint = tool({
  description: "Crea un commit/tag git en cada checkpoint aprobado con estado del pipeline",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    checkpoint_name: tool.schema.string().describe("Nombre del checkpoint (ej: checkpoint_1)"),
    approved: tool.schema.boolean().describe("true=APPROVED, false=REJECTED"),
    notes: tool.schema.string().optional(),
    author_name: tool.schema.string().optional(),
    author_email: tool.schema.string().optional(),
  },
  async execute(args) {
    let authorName = args.author_name, authorEmail = args.author_email
    try {
      if (!authorName) authorName = execSync("git config user.name", { cwd: args.project_path, encoding: "utf-8" }).trim()
      if (!authorEmail) authorEmail = execSync("git config user.email", { cwd: args.project_path, encoding: "utf-8" }).trim()
    } catch {}
    const pointerPath = path.join(args.project_path, ".orquestador", "_pointer.json")
    let pipelineInfo = {}
    if (fs.existsSync(pointerPath)) {
      const pointer = JSON.parse(fs.readFileSync(pointerPath, "utf-8"))
      pipelineInfo = { flow: pointer.flow, impact: pointer.impact, change_type: pointer.change_type, user_request: pointer.user_request, current_phase: pointer.phase_order?.[pointer.current_index] }
    }
    const ts = new Date().toISOString()
    const status = args.approved ? "APPROVED" : "REJECTED"
    const branch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: args.project_path, encoding: "utf-8" }).trim()
    const head = execSync("git rev-parse HEAD", { cwd: args.project_path, encoding: "utf-8" }).trim()
    const msg = `orquestador: ${status} ${args.checkpoint_name}\n\nPipeline: ${JSON.stringify(pipelineInfo)}\nCheckpoint: ${args.checkpoint_name}\nStatus: ${status}\nValidated by: ${authorName} <${authorEmail}>\nTimestamp: ${ts}\nGit branch: ${branch}\nGit HEAD: ${head}${args.notes ? `\n\nNotas:\n${args.notes}` : ""}`.trim()
    try {
      execSync(`git tag -a "${args.checkpoint_name}" -m "${msg}" HEAD`, { cwd: args.project_path, encoding: "utf-8", env: { ...process.env, GIT_AUTHOR_NAME: authorName || "Orquestador", GIT_AUTHOR_EMAIL: authorEmail || "orquestador@local", GIT_COMMITTER_NAME: authorName || "Orquestador", GIT_COMMITTER_EMAIL: authorEmail || "orquestador@local" } })
    } catch {
      try {
        const mp = path.join(args.project_path, ".git", `MSG_${Date.now()}`)
        fs.writeFileSync(mp, msg)
        execSync(`git commit --allow-empty -F "${mp}"`, { cwd: args.project_path, encoding: "utf-8", env: { ...process.env, GIT_AUTHOR_NAME: authorName || "Orquestador", GIT_AUTHOR_EMAIL: authorEmail || "orquestador@local", GIT_COMMITTER_NAME: authorName || "Orquestador", GIT_COMMITTER_EMAIL: authorEmail || "orquestador@local" } })
        fs.unlinkSync(mp)
      } catch (e: any) {
        return JSON.stringify({ error: `No pude crear tag/commit: ${e.message}` })
      }
    }
    let newRef = ""
    try { newRef = execSync(`git rev-parse ${args.checkpoint_name}`, { cwd: args.project_path, encoding: "utf-8" }).trim() } catch { newRef = execSync("git rev-parse HEAD", { cwd: args.project_path, encoding: "utf-8" }).trim() }
    return JSON.stringify({ checkpoint: args.checkpoint_name, status, ref: newRef.slice(0, 8), author: `${authorName} <${authorEmail}>`, ts, pipeline_info: pipelineInfo, summary: `${status} ${args.checkpoint_name} → ${newRef.slice(0, 8)}` }, null, 2)
  },
})

// --- Plugin export ---
export default async ({ client }: any = {}) => {
  try { client?.app?.log?.({ body: { service: "orquestador-plugin", level: "info", message: "orquestador-plugin loaded — 10 tools registered" } }) } catch {}
  return {
    tool: {
      "orquestador-state": orquestadorState,
      "orquestador-verify": orquestadorVerify,
      "orquestador-hash": orquestadorHash,
      "orchestrator-summary": orchestratorSummary,
      "orchestrator-frontmatter": orchestratorFrontmatter,
      "orchestrator-entry-check": orchestratorEntryCheck,
      "orchestrator-retry-report": orchestratorRetryReport,
      "orchestrator-diff-summary": orchestratorDiffSummary,
      "orchestrator-dependency-groups": orchestratorDependencyGroups,
      "orchestrator-context-update": orchestratorContextUpdate,
      "orchestrator-phase-template": orchestratorPhaseTemplate,
      "orchestrator-cleanup": orchestratorCleanup,
      "orchestrator-git-checkpoint": orchestratorGitCheckpoint,
    },
  }
}
