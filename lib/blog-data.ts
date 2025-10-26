// lib/blog-data.ts
import { BlogPost, User } from '@/types/blog';

// Datos de ejemplo
let posts: BlogPost[] = [
  {
    id: '1',
    title: 'Bienvenidos al Instituto Pompilio Ortega',
    content: 'Contenido del primer post...',
    excerpt: 'Una cálida bienvenida a todos nuestros estudiantes y familias...',
    author: 'Administración',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
    tags: ['bienvenida', 'instituto']
  }
];

export const user: User = {
  username: 'admin',
  password: 'admin123'
};

// Simular operaciones de base de datos
export const blogData = {
  getPosts: async (): Promise<BlogPost[]> => {
    return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getPost: async (id: string): Promise<BlogPost | null> => {
    return posts.find(post => post.id === id) || null;
  },

  createPost: async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
    const newPost: BlogPost = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    posts.push(newPost);
    return newPost;
  },

  updatePost: async (id: string, postData: Partial<BlogPost>): Promise<BlogPost | null> => {
    const index = posts.findIndex(post => post.id === id);
    if (index === -1) return null;

    posts[index] = {
      ...posts[index],
      ...postData,
      updatedAt: new Date().toISOString()
    };
    return posts[index];
  },

  deletePost: async (id: string): Promise<boolean> => {
    const index = posts.findIndex(post => post.id === id);
    if (index === -1) return false;
    
    posts.splice(index, 1);
    return true;
  },

  verifyCredentials: async (username: string, password: string): Promise<boolean> => {
    return username === user.username && password === user.password;
  }
};