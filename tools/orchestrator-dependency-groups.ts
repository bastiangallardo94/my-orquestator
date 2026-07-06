import { tool } from "@opencode-ai/plugin"
import path from "path"
import fs from "fs"

export default tool({
  description: "Lee dependency-groups.json y retorna los grupos de paralelización para phase_3_coding. Indica cuáles archivos pueden ejecutarse en paralelo.",
  args: {
    project_path: tool.schema.string().describe("Ruta absoluta del proyecto")
  },
  async execute(args, ctx) {
    const dgPath = path.join(args.project_path, ".orquestador", "dependency-groups.json")

    if (!fs.existsSync(dgPath)) {
      return JSON.stringify({
        error: "No existe dependency-groups.json. Ejecutá phase_2_8 primero.",
        hint: "phase_2_8_dependency_analysis genera este archivo",
      })
    }

    const dg = JSON.parse(fs.readFileSync(dgPath, "utf-8"))

    // Validate structure
    if (!dg.groups || !Array.isArray(dg.groups)) {
      return JSON.stringify({ error: "dependency-groups.json tiene formato inválido: falta groups[]" })
    }

    // Build execution plan
    const plan: {
      sequential_groups: Array<{ group_id: number; files: string[]; can_parallel: boolean }>
      parallel_within_group: boolean
      total_files: number
    } = {
      sequential_groups: [],
      parallel_within_group: dg.parallel_within_group ?? true,
      total_files: 0,
    }

    for (let i = 0; i < dg.groups.length; i++) {
      const group = dg.groups[i]
      plan.sequential_groups.push({
        group_id: i + 1,
        files: group.files || [],
        can_parallel: dg.parallel_within_group && (group.files?.length > 1),
      })
      plan.total_files += (group.files?.length || 0)
    }

    // Text summary for tool output
    const table = plan.sequential_groups.map(g =>
      `[Grupo ${g.group_id}] ${g.can_parallel ? "� Parallel" : "  Seq    "} → ${g.files.join(", ")}`
    ).join("\n")

    return JSON.stringify({
      groups: plan.sequential_groups,
      parallel_within_group: plan.parallel_within_group,
      total_files: plan.total_files,
      group_count: dg.groups.length,
      table,
      summary: `${dg.groups.length} grupos, ${plan.total_files} archivos. Paralelismo dentro de grupo: ${plan.parallel_within_group ? "ON" : "OFF"}`,
    }, null, 2)
  },
})
