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

## Pipeline Overview

| Phase | Description | Agent |
|-------|-------------|-------|
| Phase 0 | Bootstrap + MCP detection | orquestador |
| Phase 0.5 | Validate architecture maps | deep |
| Phase 1 | Business analysis + CHANGELOG_LOGICO | deep |
| Checkpoint 1 | Approve analysis | — |
| Phase 2 Backend | Technical plan (TDD) | deep |
| Phase 2 Frontend | Technical plan (TDD) | deep |
| Phase 2.5 | Playwright E2E plan | fast |
| Phase 2.7 | Plan Integrity Check (PIC) | fast |
| Phase 2.8 | Dependency analysis | fast |
| Phase 3 | Coding (TDD: RED→GREEN→VALIDATE) | fast (sub-deep) |
| Phase 3.5 | Code review | fast |
| Checkpoint 3 | Approve coding | — |
| Phase 4 | QA + testing | fast |
| Checkpoint 4 | Approve QA | — |
| Phase 5 | Documentation | fast |
| Phase 6 | Final report | — |

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
- `orquestador_v2` — Main TDD pipeline (15+ phases)
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
├── skills/                  # 20+ skills
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
Phase 0: Detect flow (TACTICO), impact (BACKEND), MCP availability
  ↓
Phase 0.5: Validate architecture maps
  ↓
Phase 1: Analyze business requirements → CHANGELOG_LOGICO.md
  ↓
Checkpoint 1: "Is the analysis correct?" [question]
  ↓
Phase 2: Generate technical plan → Plan_Backend.md
  ↓
Checkpoint 2: "Approve plan for coding?" [question]
  ↓
Phase 3: TDD coding (RED → GREEN → VALIDATE per file)
  ↓
Phase 3.5: Code review + lint + compile check
  ↓
Checkpoint 3: "Approve for QA?" [question]
  ↓
Phase 4: Run tests, verify coverage
  ↓
Phase 6: Final report
```

## Requirements

- [OpenCode](https://opencode.ai) v1.0+
- [codebase-memory-mcp](https://github.com/nicobailon/codebase-memory-mcp) (optional, for code graph)
- An LLM provider configured in OpenCode (OpenAI, Anthropic, etc.)

## License

MIT

## Credits

Built with [OpenCode](https://opencode.ai) — the open source AI coding agent.
