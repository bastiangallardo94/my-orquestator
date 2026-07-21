# Offsite Mode — Slack Bridge Protocol

Activado SOLO cuando `--offsite` esta presente en el trigger.
Cargado bajo demanda — no agregar al SKILL.md principal.

## Activacion
Detectado en Phase 0 Bootstrap: si `user_request` contiene `--offsite`, guardar `offsite: true` en `state.yaml`.

## Requisitos
MCP server `slack-bridge` debe estar habilitado en opencode.json.

## Flujo Offsite Global (reemplaza TODO question())

Cuando `offsite: true`, CADA llamada a question() se enruta a Slack:

```
1. Leer state.yaml → offsite flag
2. Si offsite == true:
   a. PREGUNTA CON OPCIONES:
      slack_bridge_ask_question(q_id, title, summary, question, options, allow_custom, project_name)
      → ≤5 opciones: botones individuales
      → >5 opciones: static_select dropdown
      → Siempre boton "✏️ Custom answer"
      slack_bridge_wait_for_answer(q_id) → { answer, answer_type, user_name }

   b. PREGUNTA DE TEXTO LIBRE:
      slack_bridge_ask_text(q_id, title, summary, question, project_name)
      slack_bridge_wait_for_answer(q_id)

   c. CHECKPOINTS:
      slack_bridge_send_checkpoint(checkpoint_id, title, summary, question, project_name)
      slack_bridge_wait_for_checkpoint(checkpoint_id)
      → Botones Approve/Reject

3. Si offsite == false → usar question() normal
```

## Herramientas MCP

| Tool | Uso |
|------|-----|
| slack_bridge_ask_question | Pregunta con opciones |
| slack_bridge_ask_text | Pregunta de texto libre |
| slack_bridge_wait_for_answer | Polling hasta respuesta |
| slack_bridge_send_checkpoint | Checkpoint Approve/Reject |
| slack_bridge_wait_for_checkpoint | Polling para checkpoint |
| slack_bridge_cancel_checkpoint | Cancelar activo |
| slack_bridge_send_message | Enviar texto a Slack |
| slack_bridge_status | Verificar estado |

## Health Check (Phase 0)
Si offsite activo:
1. Listar MCP servers → buscar slack-bridge
2. Si disponible: slack_bridge_status()
   - running + slack_connected → continuar
   - fallo → question() reintentar/usar terminal/ver instrucciones
3. Si no disponible → question() terminal/instrucciones

## Fallback
Si tools del bridge fallan → usar question() en terminal. No detener pipeline.

## Variables de Entorno
- SLACK_BOT_TOKEN, SLACK_APP_TOKEN, SLACK_SIGNING_SECRET, SLACK_CHANNEL_ID, SLACK_BRIDGE_HTTP_PORT (default: 3121)
