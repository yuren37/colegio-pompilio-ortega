// lib/blogStorage.ts
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  published: boolean;
  imageUrl: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

class BlogStorage {
  private readonly STORAGE_KEY = 'blogPosts';

  // Función para convertir File a Base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Función para procesar imagen del blog
  private async procesarImagen(file: File): Promise<string> {
    if (!file.type.startsWith('image/')) {
      throw new Error('Por favor, selecciona un archivo de imagen válido');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('La imagen debe ser menor a 5MB');
    }

    return await this.fileToBase64(file);
  }

  // Obtener todos los posts
  getPosts(): BlogPost[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const posts = localStorage.getItem(this.STORAGE_KEY);
      if (posts) {
        const parsedPosts = JSON.parse(posts);
        // Convertir strings de fecha de vuelta a objetos Date
        return parsedPosts.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
        }));
      }
    } catch (error) {
      console.error('Error loading blog posts:', error);
    }
    
    return [];
  }

  // Obtener post por ID
  getPostById(id: string): BlogPost | null {
    const posts = this.getPosts();
    return posts.find(post => post.id === id) || null;
  }

  // Crear nuevo post
  async createPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> & { imageFile?: File }): Promise<BlogPost> {
    let imageUrl = postData.imageUrl;
    
    // Si hay un archivo de imagen, procesarlo a Base64
    if (postData.imageFile) {
      try {
        imageUrl = await this.procesarImagen(postData.imageFile);
      } catch (error) {
        console.error('Error procesando imagen:', error);
        throw error;
      }
    }

    const newPost: BlogPost = {
      id: Date.now().toString(),
      ...postData,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const posts = this.getPosts();
    posts.unshift(newPost);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
    
    return newPost;
  }

  // Actualizar post
  async updatePost(id: string, postData: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>> & { imageFile?: File }): Promise<BlogPost | null> {
    const posts = this.getPosts();
    const postIndex = posts.findIndex(post => post.id === id);
    
    if (postIndex === -1) return null;

    let imageUrl = postData.imageUrl;
    
    // Si hay un archivo de imagen, procesarlo a Base64
    if (postData.imageFile) {
      try {
        imageUrl = await this.procesarImagen(postData.imageFile);
      } catch (error) {
        console.error('Error procesando imagen:', error);
        throw error;
      }
    }

    const updatedPost: BlogPost = {
      ...posts[postIndex],
      ...postData,
      imageUrl: imageUrl || posts[postIndex].imageUrl,
      updatedAt: new Date(),
    };

    posts[postIndex] = updatedPost;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
    
    return updatedPost;
  }

  // Eliminar post
  deletePost(id: string): boolean {
    const posts = this.getPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredPosts));
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }
// En lib/blogStorage.ts - Agrega este método
getPost(id: string): BlogPost | null {
  const posts = this.getPosts();
  return posts.find(post => post.id === id) || null;
}
  // Alternar estado de publicación
  togglePublish(id: string): BlogPost | null {
    const posts = this.getPosts();
    const postIndex = posts.findIndex(post => post.id === id);
    
    if (postIndex === -1) return null;

    posts[postIndex] = {
      ...posts[postIndex],
      published: !posts[postIndex].published,
      updatedAt: new Date(),
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
    return posts[postIndex];
  }

  // Obtener posts publicados
  getPublishedPosts(): BlogPost[] {
    return this.getPosts().filter(post => post.published);
  }

  // Obtener posts por tag
  getPostsByTag(tag: string): BlogPost[] {
    return this.getPosts().filter(post => 
      post.tags.some(postTag => 
        postTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
  }

  // Buscar posts
  searchPosts(query: string): BlogPost[] {
    const lowerQuery = query.toLowerCase();
    return this.getPosts().filter(post =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

export const blogStorage = new BlogStorage();