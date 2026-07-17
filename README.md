# My Orquestator — TDD Pipeline for OpenCode

[![OpenCode](https://img.shields.io/badge/OpenCode-compatible-blue)](https://opencode.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A deterministic TDD orchestration pipeline for [OpenCode](https://opencode.ai). Automates the full software development cycle: analysis → planning → coding → QA → documentation.

## What Is This?

`my-orquestator` is a set of **agents**, **skills**, **commands**, and **custom tools** that turn OpenCode into a structured TDD pipeline orchestrator. Instead of ad-hoc prompting, you get a deterministic state machine that:

- Reads/writes state to disk (`.orquestador/`) instead of relying on conversation memory
- Verifies outputs with file existence checks, not agent self-reports
- Uses checkpoints with `question` tool for human approval gates
- Supports parallel execution for fullstack (backend + frontend) work
- Integrates with `codebase-memory-mcp` for code-aware analysis

## Pipeline Overview (v3 — Optimized)

The pipeline was restructured from **17 to 11 phases** and **7 to 5 checkpoints** by:
- Merging risk assessment (3.7) → QA (4)
- Merging telemetry (4.5) → Report (6)
- Merging conflict detection (2.8) → PIC (2.5)
- Merging code review (3.5) + Ponytail review (5.5) → Coding (3)
- Centralizing Engram memory management (10 blocks → 1 protocol)
- Simplifying OpenSpec artifacts (5 → 2 per change)

| # | Phase | Description | Agent |
|---|-------|-------------|-------|
| 0 | Bootstrap | Warm init + MCP detection | orquestador |
| 0.5 | Validate maps | Architecture map validation | deep |
| | *checkpoint_maps* | *Auto-approve if coverage ≥ 80%* | — |
| 1 | Analyze + OpenSpec | Business analysis → CHANGELOG_LOGICO.md + formal specs | deep |
| | *checkpoint_1* | *Approve analysis + specs* | — |
| 2 | Backend + Frontend plans | Technical plans (TDD, parallel if fullstack) | deep |
| 2.5 | PIC + Conflicts | Plan Integrity Check + dependency groups + conflict detection | fast |
| | *checkpoint_2* | *Auto-approve if PIC PASS* | — |
| 3 | Coding + Review | TDD (RED→GREEN→VALIDATE) + code review + Ponytail quality inline | fast |
| | *checkpoint_3* | *Approve coding* | — |
| 4 | QA + Risk Assess | Risk-based testing, API/DB audit, E2E | fast |
| | *checkpoint_4* | *Approve QA* | — |
| 5 | Docs (COMPLETO only) | Technical docs | fast |
| 6 | Report + Telemetry | Final report + pipeline metrics inline | orquestador |

## Triggers

| Trigger | Flow | Description |
|---------|------|-------------|
| `orquesta:` | COMPLETO or TACTICO | Full pipeline |
| `feature:` | TACTICO | New feature (forced) |
| `analiza:` | DRY_RUN | Analysis only |
| Jira ID (e.g. `PROJ-123`) | COMPLETO | Auto-detected |

## Installation

```bash
# 1. Clone the repo
git clone https://github.com/bastiangallardo94/my-orquestator.git ~/my-orquestator

# 2. Run install script
cd ~/my-orquestator
chmod +x install.sh
./install.sh
```

The install script:
- Creates **symlinks** from `~/.config/opencode/` to the repo
- Copies `opencode.json.example` → `opencode.json` (first time only)
- Copies `AGENTS.md.example` → `AGENTS.md` (first time only)

### Update

```bash
cd ~/my-orquestator
git pull
# Done! Symlinks automatically pick up changes.
```

## Configuration

After installation, edit `~/.config/opencode/opencode.json`:

1. Set your `codebase-memory-mcp` path
2. Add your MCP server credentials (Atlassian, etc.)
3. Configure your preferred models

See `opencode.json.example` for the reference configuration.

## Agents

| Agent | Mode | Model | Purpose |
|-------|------|-------|---------|
| `orquestador` | subagent | default | Entry point, loads `orquestador_v2` skill |
| `orquestador-deep` | subagent (hidden) | configurable | Analysis, planning, complex coding |
| `orquestador-fast` | subagent (hidden) | configurable | QA, docs, dependencies, reviews |

Agents are defined in `agents/` with full permission granularity. Deep and fast agents are `hidden: true` (only invocable via `task()`, not `@mention`).

## Custom Tools

| Tool | Description |
|------|-------------|
| `orquestador-state` | Reads `.orquestador/_pointer.json`, returns formatted pipeline state |
| `orquestador-verify` | Verifies exit files of a phase exist on disk |
| `orquestador-hash` | SHA256 of input files for phase caching |

## Skills Included

### Core (Orchestration)
- `orquestador_v2` — Main TDD pipeline (11 phases, 5 checkpoints, 2.8K lines)
- `coder_agent` — Senior Software Engineer (Ponytail Mode)
- `backend_planner` — Backend architecture (Hexagonal + TDD)
- `doc_publisher` — Technical documentation publisher
- `playwright-e2e-agent` — E2E test generation

### Catalog (Third-party patterns)
- `accessibility` — WCAG 2.2 audit
- `seo` — Search engine optimization
- `nodejs-backend-patterns` — Node.js backend best practices
- `nodejs-best-practices` — Node.js general best practices
- `vercel-composition-patterns` — React composition patterns
- `vercel-react-best-practices` — React/Next.js performance
- `tailwind-css-patterns` — Tailwind CSS utilities
- `typescript-advanced-types` — Advanced TypeScript types
- `rspack-bun-migration` — Rspack + Bun migration
- `generate-agents-md` — Generate AGENTS.md for projects
- `cc-skills-golang` — Complete Go language skill set

## Commands

| Command | Description |
|---------|-------------|
| `ponytail` | Switch ponytail intensity (lite/full/ultra/off) |
| `ponytail-review` | Code review with ponytail lens |
| `ponytail-debt` | Technical debt analysis |
| `ponytail-audit` | Full audit |
| `ponytail-help` | Help and usage |

## Directory Structure

```
my-orquestator/
├── README.md
├── LICENSE
├── install.sh
├── .gitignore
├── opencode.json.example
├── AGENTS.md.example
├── agents/
│   ├── orquestador.md
│   ├── orquestador-deep.md
│   ├── orquestador-fast.md
│   └── prompts/
│       ├── orquestador-deep-system.md
│       └── orquestador-fast-system.md
├── skills/
│   ├── orquestador_v2/          # Main TDD pipeline (11 phases)
│   │   ├── SKILL.md
│   │   ├── bin/init.md          # Cold init script
│   │   ├── planner_front.md
│   │   ├── prompts/
│   │   │   ├── core/            # Shared protocols (Engram, search, checkpoints, patterns)
│   │   │   ├── phases/          # Phase definitions (11 files)
│   │   │   └── flows/           # Specialized flows (bugfix, review, test, unit-test)
│   │   └── skills/              # Sub-skills loaded on demand (offsite, worktree)
│   ├── coder_agent/
│   ├── backend_planner/
│   └── ...                      # 15+ catalog skills
├── commands/                # 5 ponytail commands
├── tools/                   # 3 custom tools
├── rules/                   # Orchestration rules
├── plugins/                 # Ponytail plugin
└── mcp-servers/             # REST API tester
```

## How It Works

```
User: "orquesta: add filter by date to reports"
  ↓
orquestador.md loads skill orquestador_v2
  ↓
Phase 0: Warm bootstrap (trigger, health check, confirm)
  ↓
Phase 0.5: Validate architecture maps → api-surface.md
  ↓
checkpoint_maps (auto-approve if ≥80% coverage)
  ↓
Phase 1: Analyze + OpenSpec specs → CHANGELOG_LOGICO.md + proposal.md
  ↓
checkpoint_1: "Analysis + specs correct?" [question]
  ↓
Phase 2 Backend + Frontend (parallel): Plans → Plan_Backend.md, Plan_Frontend.md
  ↓
Phase 2.5: PIC + Conflict Detection → dependency-groups.json
  ↓
checkpoint_2 (auto-approve if PIC PASS)
  ↓
Phase 3: TDD coding + inline review + Ponytail quality checks
  ↓
checkpoint_3: "Approve for QA?" [question]
  ↓
Phase 4: Risk-based QA + API/DB audit + E2E
  ↓
checkpoint_4: "Approve QA?" [question]
  ↓
Phase 6: Report + telemetry (inline) → archive
```

## What's New in v3

The orquestador_v2 skill was restructured in July 2026 with these key optimizations:

| Metric | v2 | v3 | Change |
|--------|:---:|:---:|:------:|
| Total lines | 8,159 | 2,800 | **-66%** |
| Phase files | 17 | 11 | **-6 phases** |
| Checkpoints | 7 | 5 | **-2 checkpoints** |
| SKILL.md | ~500 lines | 210 lines | **-58%** |

**Key changes:**
- **Engram centralizado**: 10 duplicated `mem_save` blocks → 1 protocol in `prompts/core/engram_protocol.md`
- **Phase mergers**: 3.7→4 (risk), 4.5→6 (telemetry), 2.8→2.7 (conflicts), 3.5→3 (review), 5.5→3 (ponytail)
- **OpenSpec simplificado**: only `proposal.md` + `specs/` per change (removed `design.md`, `tasks.md`)
- **Offsite/Worktree**: moved to sub-skills under `skills/`, loaded on demand
- **Phase 0**: reduced from 378 to 120 lines (cold init separated to `bin/init.md`)

## Requirements

- [OpenCode](https://opencode.ai) v1.0+
- [codebase-memory-mcp](https://github.com/nicobailon/codebase-memory-mcp) (optional, for code graph)
- [Context7](https://context7.com) (optional, for up-to-date library docs) — `npx ctx7 setup --opencode`
- An LLM provider configured in OpenCode (OpenAI, Anthropic, etc.)

## License

MIT

## Credits

Built with [OpenCode](https://opencode.ai) — the open source AI coding agent.
