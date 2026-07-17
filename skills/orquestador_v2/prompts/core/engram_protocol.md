# Engram Protocol — Centralized Memory Management

This is the SINGLE source of truth for all Engram interactions.
Every phase uses this protocol instead of declaring its own mem_save/mem_search blocks.

## Architecture

The orquestador (NOT sub-agents) manages Engram at phase boundaries.
Phases never call mem_* directly — they return structured data, the orquestador persists it.

```
Phase Agent (task)
  │ Returns: STRUCTURED_OUTPUT (discoveries, decisions, patterns)
  ▼
Orquestador (bucle loop)
  │ Reads: output, PHASE.id, PHASE.status
  │ Calls: engram_save(phase_id, structured_output)
  ▼
Engram
```

## Save Points

Save is triggered by PHASE.type + status, not by inline blocks:

| Event | Types to save | Source data |
|-------|---------------|-------------|
| phase_1_analyze SUCCESS | discovery, architecture (if decision found) | OUTPUT.DISCOVERIES, OUTPUT.ARCH_DECISIONS |
| phase_1_5_openspec SUCCESS | architecture (specs), pattern (if reusable found) | .orquestador/phases/phase_1_5_openspec.json |
| phase_2_backend/frontend SUCCESS | pattern (if plan reveals reusable structure) | .orquestador/phases/<id>.json |
| phase_3_coding SUCCESS | pattern (code structure discovered) | phase JSON: FILES_CREATED, spec_coverage |
| checkpoint_X APPROVED | decision | checkpoint question/response |
| phase_4_qa SUCCESS | learning (testing patterns) | phase JSON: QA_STATUS, failures |
| phase_6_report | learning (pipeline summary) | aggregated from all phases |
| **Any** pipeline_completed | session_summary, session_end | aggregated from all phases |

## Search Points

Search is triggered before phase execution, not by inline blocks:

| Event | Search query | Types |
|-------|-------------|-------|
| Before phase_1_analyze | `mem_search(query=user_request, types=[architecture,decision,pattern])` | context |
| Before phase_2_backend | `mem_search(query=domain, types=[pattern])` | code patterns |
| Before phase_2_frontend | `mem_search(query=domain, types=[pattern])` | code patterns |
| Before phase_3_coding | `mem_search(query=domain, types=[pattern])` | code patterns |
| Before any checkpoint | `mem_search(query=domain, types=[decision])` | past decisions |

## Data Format for Auto-Save

After a phase completes with SUCCESS, the orquestador reads phase JSON and calls:

```
mem_save(
  title="Phase {phase_id}: {domain}",
  content="**What**: {auto_extracted_what}\n**Why**: {from _pointer.user_request}\n**Where**: {files_created + files_modified}\n**Learned**: {extracted from phase structured_output if available}",
  type=resolve_type(phase_id),
  topic_key="phase/{phase_id}/{timestamp-short}",
  session_id=engram_session_id
)
```

The type resolver:

```
phase_1_analyze       → discovery
phase_1_5_openspec    → architecture
phase_2_backend       → pattern
phase_2_frontend      → pattern
phase_3_coding        → pattern
phase_3_5_review      → discovery (code quality)
phase_4_qa            → learning
phase_5_5_ponytail    → discovery (quality assessment)
phase_6_report        → learning
```

## Conflict Resolution

After every mem_save, check the response envelope:

```
if judgment_required:
  for candidate in candidates:
    if confidence >= 0.7 AND relation NOT IN [supersedes, conflicts_with]:
      mem_judge(judgment_id=candidate.judgment_id, relation=auto_resolve(candidate))
    else:
      inform user: "Memoria #{candidate.id} potencialmente conflictiva con nuevo dato. ¿Resuelvo?"
```

## Session Lifecycle

The orquestador handles session lifecycle centrally:

```
Phase 0 SUCCESS:
  mem_session_start(directory=cwd) → engram_session_id

Phase 6 (during report generation):
  mem_session_summary(...)
  mem_session_end(session_id=engram_session_id)

If pipeline fails mid-way:
  mem_session_end(session_id=engram_session_id, summary="Pipeline failed at {phase_id}")
```

## Topic Key Convention

```
phase/{phase_id}/{short-hash}         → phase-level artifacts
decision/{checkpoint-id}/{topic}      → checkpoint decisions
pattern/{stack}/{pattern-name}        → reusable code patterns (replaces knowledge/registry.json)
learning/{pipeline-id}/summary        → learning outcomes
architecture/{pipeline-id}/specs      → OpenSpec specs
architecture/{pipeline-id}/decisions  → architectural decisions
```

## Behavior When Engram Unavailable

- Save operations are silently skipped
- Search operations return empty results (sub-agents proceed without past context)
- Session lifecycle is skipped
- knowledge/registry.json is used as fallback for patterns (see pattern_engine.md)
- The pipeline continues normally without degradation
