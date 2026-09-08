import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Blog: un archivo Markdown por artículo en src/content/blog/.
 * Los archivos que empiezan por "_" (la plantilla) no se publican.
 * Guía para escribir uno nuevo: src/content/blog/_plantilla.md
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /** Resumen de 1–2 frases: aparece en el listado, en Google y en redes */
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    /** Nombre exacto de un miembro de src/data/team.ts, o "Equipo IonosHub" */
    author: z.string().default('Equipo IonosHub'),
    category: z.enum(['noticia', 'guia', 'opinion', 'caso']).default('guia'),
    tags: z.array(z.string()).default([]),
    /** Pilar relacionado: activa el bloque "Cómo lo aplicamos" al final */
    pillar: z.enum(['ia', 'automatizaciones', 'marketing', 'software']).optional(),
    /** Imagen de portada en /public (p. ej. /imgs/blog/mi-articulo.webp) y su texto alternativo */
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    /** Publicación original o colaboración (medio, biblioteca, evento) */
    source: z.object({ name: z.string(), url: z.string().url().optional() }).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
