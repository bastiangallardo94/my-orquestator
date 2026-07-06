import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"

export default tool({
  description: "Evalúa una entry_condition (string natural) contra el filesystem real. Soporta: existencia de archivos, AND (&&), OR (||), negación (!).",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto"),
    entry_condition: tool.schema.string().describe("Condición a evaluar (ej: 'docs/CHANGELOG_LOGICO.md debe existir && src/ está presente')"),
    condition_type: tool.schema.enum(["entry_condition", "glob", "file"]).optional().describe("Tipo de condición (default: entry_condition)")
  },
  async execute(args, ctx) {
    const condition = args.entry_condition.trim()

    if (!condition) {
      return JSON.stringify({ passed: false, error: "Condición vacía" })
    }

    function fileExists(relPath: string): boolean {
      const full = path.join(args.project_path, relPath)
      return fs.existsSync(full)
    }

    function dirExists(relPath: string): boolean {
      const full = path.join(args.project_path, relPath)
      try {
        return fs.statSync(full).isDirectory()
      } catch {
        return false
      }
    }

    function evaluate(expr: string): boolean {
      expr = expr.trim()

      // Handle negación: !algo
      if (expr.startsWith("!")) {
        const inner = expr.slice(1).trim()
        return !evaluate(inner)
      }

      // Handle AND: a && b
      const andParts = expr.split("&&").map(s => s.trim())
      if (andParts.length > 1) {
        return andParts.every(p => evaluate(p))
      }

      // Handle OR: a || b
      const orParts = expr.split("||").map(s => s.trim())
      if (orParts.length > 1) {
        return orParts.some(p => evaluate(p))
      }

      // Handle parenthetical groups
      if (expr.startsWith("(") && expr.endsWith(")")) {
        return evaluate(expr.slice(1, -1))
      }

      // Normalize variations of "debe existir" / "should exist" etc.
      const normalized = expr
        .replace(/debe existir/gi, "")
        .replace(/must exist/gi, "")
        .replace(/should exist/gi, "")
        .replace(/tiene que existir/gi, "")
        .replace(/must be present/gi, "")
        .replace(/está presente/gi, "")
        .replace(/is present/gi, "")
        .replace(/debe estar presente/gi, "")
        .trim()

      // If it ends with / it's a directory
      if (normalized.endsWith("/")) {
        return dirExists(normalized)
      }

      // Otherwise check file
      return fileExists(normalized)
    }

    try {
      const passed = evaluate(condition)
      return JSON.stringify({
        passed,
        condition: condition,
        evaluated: passed ? "PASS" : "FAIL",
        summary: passed
          ? `ENTRY CHECK PASS: ${condition}`
          : `ENTRY CHECK FAIL: ${condition}`,
      }, null, 2)
    } catch (err) {
      return JSON.stringify({ passed: false, error: `Error evaluando: ${err}`, condition })
    }
  },
})
