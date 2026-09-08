import type { CollectionEntry } from 'astro:content';
import { team } from '../data/team';

export type Post = CollectionEntry<'blog'>;

export const CATEGORY_LABEL: Record<Post['data']['category'], string> = {
  noticia: 'Noticia',
  guia: 'Guía',
  opinion: 'Opinión',
  caso: 'Caso',
};

export const postUrl = (post: Post) => `/blog-recursos/${post.id}`;

export const formatDate = (d: Date) =>
  new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);

/** ~190 palabras por minuto en español; mínimo 1. */
export const readingMinutes = (body = '') => Math.max(1, Math.round(body.trim().split(/\s+/).length / 190));

/** Autor: miembro del equipo (con foto y cargo) o la firma genérica. */
export const resolveAuthor = (name: string) => {
  const member = team.find((m) => m.name === name);
  return member
    ? { name: member.name, role: member.role, photo: member.photo, url: '/equipo' }
    : { name: 'Equipo IonosHub', role: 'Dirección, desarrollo, automatizaciones y marketing', photo: null, url: '/equipo' };
};

export const sortByDate = (posts: Post[]) => [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
