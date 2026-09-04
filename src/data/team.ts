export interface TeamMember {
  name: string;
  role: string;
  expertise: string;
  photo: string;
  area: 'Dirección' | 'Desarrollo' | 'Automatizaciones' | 'Marketing';
}

/* Fuente: repo v1 (src/data/team.ts). Fotos en /public/imgs/equipo. */
export const team: TeamMember[] = [
  {
    name: 'Orlidan Montesdeoca',
    role: 'Director Ejecutivo · Cofundador',
    expertise:
      'DevOps, análisis de datos, infraestructura cloud, IA y automatización avanzada con RAGs. Relación con clientes.',
    photo: '/imgs/equipo/orli.webp',
    area: 'Dirección',
  },
  {
    name: 'Cristhian Recalde',
    role: 'Director Financiero y Operaciones · Cofundador',
    expertise:
      'Gestión de recursos y proyectos; líder de desarrollo móvil (Flutter); expositor en comunidades AWS y Google.',
    photo: '/imgs/equipo/gris.webp',
    area: 'Dirección',
  },
  {
    name: 'Alan Rodríguez',
    role: 'PMO',
    expertise: 'Bases de datos transaccionales, levantamiento de propuestas y organización bajo SCRUM.',
    photo: '/imgs/equipo/alan.webp',
    area: 'Desarrollo',
  },
  {
    name: 'David Villarreal',
    role: 'Especialista en Automatizaciones y Desarrollo Web',
    expertise: 'Flujos de automatización y soporte técnico; apoyo en diseño y maquetado web.',
    photo: '/imgs/equipo/deivid.webp',
    area: 'Automatizaciones',
  },
  {
    name: 'Camila Navarrete',
    role: 'CMO',
    expertise: 'Gestión de redes sociales y cobertura de eventos.',
    photo: '/imgs/equipo/cami.webp',
    area: 'Marketing',
  },
  {
    name: 'Domenica Alvarez',
    role: 'Representante de Marca',
    expertise: 'Imagen pública para clientes; naturalidad en cámara y eventos.',
    photo: '/imgs/equipo/dome.webp',
    area: 'Marketing',
  },
];
