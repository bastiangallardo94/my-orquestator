---
description: "Subagente rápido para QA, dependencias, docs y reportes en el flujo de orquestación"
mode: subagent
hidden: true
model: opencode/gpt-5.1-codex
temperature: 0.3
color: "#10b981"
steps: 20
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
  question: allow
  todowrite: allow
  webfetch: allow
  mcp:
    codebase-memory-mcp: allow
    atlassian: allow
    backend-api-qa: allow
---

{file:./prompts/orquestador-fast-system.md}
