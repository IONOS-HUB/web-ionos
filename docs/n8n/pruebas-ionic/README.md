# Prueba de humo de IONIC (Jhonny)

Cinco escenarios para comprobar, después de cada cambio en el flujo **IONIC** de n8n, que las rutas principales siguen funcionando. Se corren en **modo prueba** (`test_workflow` del MCP de n8n, o «Test workflow» con datos fijados), con el disparador **Mensaje recibido IONIC**. No escriben a nadie.

Cada archivo es un objeto `pinData`: fija la salida de todo lo que toca el exterior (Chatwoot, WhatsApp, Redis, GHL, la IA y los subflujos), así que solo se ejecuta la lógica del propio flujo: códigos, condiciones y rutas.

| Archivo | Qué simula | Resultado esperado |
|---|---|---|
| `lead-califica.json` | Un lead cuenta su problema y Jhonny devuelve el JSON del lead | `Ruta Salida Bienvenida` sale por **lead_calificado** → `Confirmar Lead y Pedir Detalle` y `GHL · Upsert Lead · Calificado` |
| `descarte-estudiante.json` | Un estudiante sin negocio; Jhonny devuelve `{"descartar": true}` | Sale por **descartar** → despedida, etiqueta `apagar_agente`, nota privada, `GHL · Mover Etapa · No calificado`; **no** pasa por `Enviar Respuesta Bienvenida` |
| `umbral-apagar.json` | Mensaje n.º 31 de una racha | `Umbral · Decidir` → `accion: apagar`; no llega a `Tipo de Entrada` |
| `umbral-foto-ignorada.json` | 4.ª foto de la racha | `Umbral · Decidir` → `accion: ignorar`; no se ejecuta nada más |
| `descarte-en-agendamiento.json` | Ya en la etapa de agendar, la persona dice que no le escriban más; el agente de diagnóstico devuelve `{"descartar": true}` | `Ruta Salida Diagnóstico` sale por **descartar** → `Datos Descarte` → la misma despedida, etiqueta, nota y «12. No calificado» que en la bienvenida |

Notas:
- `Umbral · Nota privada` y `Nota privada (Descarte)` se dejan sin fijar a propósito: llaman de verdad al subflujo **Chatwoot · Nota privada**, pero con la conversación ficticia `99999`, que no existe (Chatwoot responde 404). Así se comprueba que las expresiones del texto se arman bien.
- Si se renombra un nodo de IONIC, hay que renombrar su clave en estos archivos.
- Teléfono de prueba: `+593990000001`; conversación: `99999`.
