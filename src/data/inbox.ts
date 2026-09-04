import type { PillarId } from './pillars';

/**
 * Guion de la bandeja de IONIC (hero).
 * CONTENIDO DEMOSTRATIVO: negocios y personas ficticios, etiquetados como
 * demostración en la interfaz. No representan clientes reales.
 */

export interface InboxMessage {
  from: 'client' | 'ionic';
  text: string;
  /** Tarjeta de acción que IONIC adjunta (cita, consulta, etc.) */
  card?: { title: string; detail: string };
}

export interface InboxConversation {
  id: string;
  business: string;
  person: string;
  initials: string;
  channel: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Llamada';
  pillar: PillarId;
  preview: string;
  time: string;
  messages: InboxMessage[];
}

export const conversations: InboxConversation[] = [
  {
    id: 'consultorio',
    business: 'Consultorio Dental Norte',
    person: 'Paola R.',
    initials: 'PR',
    channel: 'Llamada',
    pillar: 'ia',
    preview: 'Llamada atendida por la IA de voz · 1:12',
    time: '21:14',
    messages: [
      { from: 'client', text: 'Buenas noches, quería una cita para limpieza dental esta semana.' },
      {
        from: 'ionic',
        text: 'Con gusto, Paola. Tengo el jueves a las 10:30 o el viernes a las 16:00. ¿Cuál le conviene?',
      },
      { from: 'client', text: 'El jueves a las 10:30.' },
      {
        from: 'ionic',
        text: 'Queda agendada. Le enviaré un recordatorio por WhatsApp el miércoles en la noche. ¡Hasta el jueves!',
        card: { title: 'Cita agendada por voz', detail: 'Jueves · 10:30 · Recordatorio programado' },
      },
    ],
  },
  {
    id: 'ferreteria',
    business: 'Ferretería El Tornillo',
    person: 'Don Marco',
    initials: 'DM',
    channel: 'WhatsApp',
    pillar: 'automatizaciones',
    preview: '¿Me pasan el reporte de ventas de la semana?',
    time: '07:02',
    messages: [
      { from: 'client', text: '¿Me pasan el reporte de ventas de la semana?' },
      {
        from: 'ionic',
        text: 'Aquí está, Don Marco. Se generó automáticamente a las 7:00 con los datos del sistema.',
        card: { title: 'Reporte semanal listo', detail: 'Ventas · Inventario bajo · Cobros pendientes' },
      },
      { from: 'client', text: 'Antes me tomaba toda la mañana 😅' },
      { from: 'ionic', text: 'Ahora llega solo cada lunes. Si quieres, lo programo también para tu contadora.' },
    ],
  },
  {
    id: 'restaurante',
    business: 'La Esquina Parrilla',
    person: 'Andrea',
    initials: 'AN',
    channel: 'Instagram',
    pillar: 'marketing',
    preview: 'Vi el anuncio del combo familiar 🔥',
    time: '19:48',
    messages: [
      { from: 'client', text: 'Vi el anuncio del combo familiar 🔥 ¿hacen envíos a Los Ceibos?' },
      { from: 'ionic', text: '¡Sí, Andrea! Llegamos a Los Ceibos en 35 min. ¿Para cuántas personas?' },
      { from: 'client', text: 'Somos 5' },
      {
        from: 'ionic',
        text: 'Perfecto. Te dejo el pedido preparado; sólo confirma la dirección.',
        card: { title: 'Lead desde pauta Meta', detail: 'Campaña "Combo familiar" · Instagram' },
      },
    ],
  },
  {
    id: 'academia',
    business: 'Academia Ibarra Idiomas',
    person: 'Lic. Torres',
    initials: 'LT',
    channel: 'Facebook',
    pillar: 'software',
    preview: 'Necesitamos un sistema de calificaciones urgente',
    time: '11:26',
    messages: [
      { from: 'client', text: 'Necesitamos un sistema de calificaciones. Seguimos en Excel y papel.' },
      {
        from: 'ionic',
        text: 'Entiendo. Un sistema por roles (docentes, alumnos, padres) con reportes en línea se entrega en 30 días. ¿Le agendo un diagnóstico con el equipo?',
      },
      { from: 'client', text: 'Sí, esta semana si es posible' },
      {
        from: 'ionic',
        text: 'Agendado para el miércoles a las 9:00 con Orlidan. Le llega la invitación al correo.',
        card: { title: 'Diagnóstico agendado', detail: 'Miércoles · 9:00 · Software a medida' },
      },
    ],
  },
];
