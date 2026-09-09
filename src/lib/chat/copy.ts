/**
 * Textos visibles del chat. Este archivo SÍ puede importarlo el navegador.
 * El prompt del sistema y la base de conocimiento viven en `prompt.ts` y `knowledge.ts`,
 * que nunca deben importarse desde una isla de React: se irían en el bundle del cliente.
 */

export const GREETING =
  'Hola, soy IONIC, el asistente de IonosHub. Puedo contarte cómo automatizamos la atención de un negocio como el tuyo, o agendarte un diagnóstico gratuito de 30 minutos. ¿Qué te trae por aquí?';

export const LIMIT_REACHED_REPLY =
  'Hasta aquí llego en este chat. Para seguir la conversación, escríbenos por WhatsApp o elige día y hora en la agenda: tienes los dos botones abajo.';

export const FALLBACK_REPLY =
  'Se me complicó responder en este momento. Escríbenos por WhatsApp o elige un horario en la agenda y te atendemos igual.';

export const SENSITIVE_REPLY =
  'Por seguridad no pedimos ni tratamos datos sensibles por chat. Para agendar sólo necesito tu nombre, qué te interesa, un teléfono y un correo.';

export const CLOSED_REPLY =
  'Ya tengo tus datos y un asesor de IonosHub se pondrá en contacto contigo en las próximas horas. Si quieres adelantar algo, escríbenos por WhatsApp.';
