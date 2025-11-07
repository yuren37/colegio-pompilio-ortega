// pages/api/blog/posts.ts (o app/api/blog/posts/route.ts si usas App Router)
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { limit = '3' } = req.query;

  try {
    // Aquí deberías conectar con tu base de datos o CMS
    // Por ejemplo, si usas Prisma:
    // const posts = await prisma.post.findMany({
    //   take: parseInt(limit as string),
    //   orderBy: { publishedAt: 'desc' },
    //   where: { published: true }
    // });

    // Por ahora, devolvemos datos de ejemplo
    const posts = [
      {
        id: '1',
        title: 'Nuevos Métodos de Enseñanza en Matemáticas',
        excerpt: 'Exploramos las técnicas más innovadoras para enseñar matemáticas en el siglo XXI.',
        content: 'Contenido completo del post...',
        author: 'Prof. María González',
        publishedAt: '2024-01-15T00:00:00Z',
        slug: 'nuevos-metodos-matematicas',
        category: 'Educación',
        imageUrl: '/images/blog/matematicas.jpg'
      },
      // ... más posts
    ];

    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}