---
description: "Subagente profundo para análisis, planificación y codificación TDD en el flujo de orquestación"
mode: subagent
hidden: true
model: opencode/gpt-5.1-codex
temperature: 0.1
color: "#6366f1"
steps: 30
permission:
  read: allow
  edit: allow
  glob: allow
  grep: allow
  bash:
    "*": ask
    "npm *": allow
    "git status *": allow
    "grep *": allow
  task:
    "*": deny
  skill: allow
  webfetch: allow
  question: allow
  todowrite: allow
  mcp:
    codebase-memory-mcp: allow
    atlassian: allow
    backend-api-qa: allow
---

{file:./prompts/orquestador-deep-system.md}
