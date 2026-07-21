---
module_id: offsite-global
load_on: [phase_0_bootstrap, checkpoint, all_phases]
audience: orchestrator
description: Modo Offsite — redirige TODAS las interacciones a Slack via slack-bridge MCP
---

## Modo Offsite Global (Slack Bridge)

El modo offsite permite que **TODAS** las interacciones con el usuario (checkpoints, preguntas de bootstrap, selección de modo, manejo de fallos, etc.) se envíen a **Slack** en lugar de usar `question()` interactivo en la terminal. El usuario responde desde Slack y el bridge recoge la respuesta.

### Activación

Se activa automáticamente cuando el usuario incluye `--offsite` en su prompt:
```
@orquestador --offsite feature: login
feature: --offsite add user CRUD
--offsite orquesta: refactor API
```

El flag `--offsite` se detecta en Phase 0 Bootstrap y se guarda como `offsite: true` en `state.yaml`.

### Requisitos (slack-bridge MCP)

El MCP server `slack-bridge` debe estar habilitado en `opencode.json`. El bridge:
- Se auto-inicia cuando opencode arranca (declarado como MCP local)
- Conecta a Slack via Socket Mode
- Inicia ngrok automáticamente para exponer endpoint HTTPS
- Escucha interacciones de botones, selects dropdowns y modales de texto

### Flujo Offsite Global (reemplaza TODO `question()`)

Cuando `offsite: true`, CADA llamado a `question()` se enruta a Slack:

```
1. Leer state.yaml → offsite flag
2. Si offsite == true:
   a. PREGUNTA CON OPCIONES (options[]):
      - slack_bridge_ask_question(q_id, title, summary, question, options, allow_custom=true, project_name)
        → ≤5 opciones: botones individuales
        → >5 opciones: static_select dropdown
        → Siempre incluye botón "✏️ Custom answer" (abre modal de texto)
      - slack_bridge_wait_for_answer(q_id)
        → Retorna { answer, answer_type, user_name }
      - Usar answer como resultado

   b. PREGUNTA DE TEXTO LIBRE (sin options):
      - slack_bridge_ask_text(q_id, title, summary, question, project_name)
        → Botón "✏️ Write answer" → modal de texto libre
      - slack_bridge_wait_for_answer(q_id)

   c. MULTI-PREGUNTA (questions[] array):
      - Enviar UNA POR UNA secuencialmente:
        ask_question(q1) → wait → ask_question(q2) → wait → ...

   d. CHECKPOINTS (flujo existente):
      - slack_bridge_send_checkpoint(...) + slack_bridge_wait_for_checkpoint(...)
        → Aprobación/Rechazo con botones Approve/Reject
      - Ver prompts/checkpoints.md para reglas específicas

3. Si offsite == false → usar question() normal
```

### Herramientas MCP (slack-bridge)

| Tool | Descripción |
|------|-------------|
| `slack-bridge` → `slack_bridge_ask_question` | Enviar pregunta con opciones (botones o dropdown) + custom text modal |
| `slack-bridge` → `slack_bridge_ask_text` | Enviar pregunta de texto libre que abre modal |
| `slack-bridge` → `slack_bridge_wait_for_answer` | Polling hasta que el usuario responda (retorna answer + user_name) |
| `slack-bridge` → `slack_bridge_send_checkpoint` | Enviar checkpoint con botones Approve/Reject |
| `slack-bridge` → `slack_bridge_wait_for_checkpoint` | Polling para checkpoints |
| `slack-bridge` → `slack_bridge_cancel_checkpoint` | Cancelar pregunta/checkpoint activo |
| `slack-bridge` → `slack_bridge_send_message` | Enviar texto a Slack |
| `slack-bridge` → `slack_bridge_status` | Verificar estado del bridge (incluye ngrok URL, questions activas) |

### Checkpoint Offsite Protocol

Cuando `offsite: true`, los checkpoints usan el flujo `slack_bridge_send_checkpoint` + `slack_bridge_wait_for_checkpoint`:

```
1. slack_bridge_send_checkpoint(checkpoint_id, title, summary, question, project_name)
   → Renderiza card en Slack con botones ✅ Approve / ❌ Reject
2. Slack user hace clic en un botón
3. slack_bridge_wait_for_checkpoint(checkpoint_id, poll_interval_ms=5000)
   → Retorna { status: "approved" | "rejected", user_name: "...", answer: "...", notes: "..." }
4. Si status == "approved":
    - git-checkpoint(projectPath=cwd, checkpointName=X, approved=true)
   - Avanzar pipeline
5. Si status == "rejected":
   - Registrar motivo en phases/<id>.json → error
   - Seguir protocolo de failure_handling.md
```

#### Comportamiento por tipo de checkpoint

| Tipo | Normal (terminal) | Offsite (Slack) |
|------|-------------------|-----------------|
| `checkpoint_maps` | Auto-aprueba si coverage >= 80%, si no pregunta | Auto-aprueba si coverage >= 80%, si no envía card a Slack |
| `checkpoint_1` (analyze) | question() con resumen + opciones | slack_bridge_send_checkpoint con resumen + Approve/Reject |
| `checkpoint_1_5` (openspec) | question() con resumen de escenarios + opciones | slack_bridge_send_checkpoint con escenarios + Approve/Reject |
| `checkpoint_2` (plan) | question() con tabla de plan vs archivos existentes | slack_bridge_send_checkpoint con tabla + Approve/Reject |
| `checkpoint_3` (coding) | question() con diff-summary + opciones | slack_bridge_send_checkpoint con diff-summary + Approve/Reject |
| `checkpoint_4` (qa) | question() con qa-report + opciones | slack_bridge_send_checkpoint con qa-report + Approve/Reject |
| `checkpoint_ponytail` | question() con score A-F + plan de acción | slack_bridge_send_checkpoint con score + dropdown de acción |
| `checkpoint_review` | question() con file list + approve/request-changes | slack_bridge_send_checkpoint con file list + Approve/Changes |
| `checkpoint_bugfix` | question() con resumen de fix + opciones | slack_bridge_send_checkpoint con resumen + Approve/Reject |
| `checkpoint_ut_coverage` | question() con coverage delta + opciones | slack_bridge_send_checkpoint con coverage delta + Approve/Reject |

### Variables de Entorno (para config del bridge, no para el orquestador)

- `SLACK_BOT_TOKEN` — token del bot de Slack (xoxb-...)
- `SLACK_APP_TOKEN` — token de la app para Socket Mode (xapp-...)
- `SLACK_SIGNING_SECRET` — signing secret de la Slack App
- `SLACK_CHANNEL_ID` — canal destino para checkpoints y preguntas (C0...)
- `SLACK_BRIDGE_HTTP_PORT` — puerto HTTP local (default: 3121)

### Fallback

Si las tools del bridge fallan (bridge caído), usar `question()` en terminal como fallback. No detener el pipeline.

---

## Quick Reference

Variables de entorno requeridas por el slack-bridge MCP:

```yaml
SLACK_BOT_TOKEN
SLACK_APP_TOKEN
SLACK_SIGNING_SECRET
SLACK_CHANNEL_ID
SLACK_BRIDGE_HTTP_PORT
```

---

Fallback: Si las tools del bridge fallan, usar question() en terminal. No detener el pipeline.
