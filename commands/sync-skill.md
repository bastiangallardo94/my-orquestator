---
description: Sincroniza la skill orquestador_v2 local al repo Git y hace push. Comparar → Copiar → Commit → Push.
---

## Sync Skill — Orquestador v2

### Passos

1. **COMPARAR**: `diff -rq ~/.config/opencode/skills/orquestador_v2/ ~/my-orquestator/skills/orquestador_v2/`
   - Si no hay diff → "Skill ya está al día. Nada que subir."
   - Si hay diff → continuar

2. **COPIAR al repo** (estructura jerárquica — incluye core/, phases/, flows/):
   ```
   cp -r ~/.config/opencode/skills/orquestador_v2/SKILL.md ~/my-orquestator/skills/orquestador_v2/
   cp -r ~/.config/opencode/skills/orquestador_v2/prompts/ ~/my-orquestator/skills/orquestador_v2/prompts/
   cp -r ~/.config/opencode/skills/orquestador_v2/bin/ ~/my-orquestator/skills/orquestador_v2/bin/
   cp -r ~/.config/opencode/skills/orquestador_v2/skills/ ~/my-orquestator/skills/orquestador_v2/skills/
   cp -r ~/.config/opencode/skills/orquestador_v2/planner_front.md ~/my-orquestator/skills/orquestador_v2/
   ```

3. **GIT STATUS**: `git status --short` en ~/my-orquestator/

4. **GIT ADD + COMMIT** (solo si hay cambios):
   ```
   git add skills/orquestador_v2/
   git commit -m "sync: $(date '+%Y-%m-%d %H:%M')"
   ```

5. **GIT PUSH**:
   - Configurar remote con token si es necesario
   - `git push origin main`
   - Limpiar remote URL después del push (seguridad)

6. **REPORTAR**:
   - Archivos modificados
   - Commit hash
   - URL del commit

### Notas
- El token de GitHub se pide al usuario solo si el push falla por auth
- Si el repo no existe localmente, hacer `git clone` primero
- Mensaje de commit incluye timestamp para trazabilidad
