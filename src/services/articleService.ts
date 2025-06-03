
import { Article, ArticleMeta, CategoryInfo } from '../types/article';
import { getAuthorById } from './authorService';

// Configuration des catégories
const CATEGORIES: Record<string, CategoryInfo> = {
  'developpement': {
    name: 'Développement',
    slug: 'developpement',
    description: 'Tutoriels et conseils sur le développement web',
    count: 0
  },
  'design': {
    name: 'Design',
    slug: 'design',
    description: 'UX/UI, tendances design et outils créatifs',
    count: 0
  },
  'outils': {
    name: 'Outils',
    slug: 'outils',
    description: 'Découverte d\'outils et technologies',
    count: 0
  },
  'securite': {
    name: 'Sécurité',
    slug: 'securite',
    description: 'Bonnes pratiques et conseils sécurité',
    count: 0
  }
};

// Articles statiques pour la démo
const STATIC_ARTICLES = [
  {
    category: 'developpement',
    slug: 'tendances-dev-2024',
    filePath: '/content/developpement/tendances-dev-2024.md'
  },
  {
    category: 'design',
    slug: 'design-system-guide',
    filePath: '/content/design/design-system-guide.md'
  },
  {
    category: 'outils',
    slug: 'vscode-extensions-2024',
    filePath: '/content/outils/vscode-extensions-2024.md'
  },
  {
    category: 'securite',
    slug: 'securite-web-2024',
    filePath: '/content/securite/securite-web-2024.md'
  }
];

// Cache pour les articles
let articlesCache: Article[] = [];
let cacheInitialized = false;

// Parse le front matter d'un fichier markdown
function parseFrontMatter(content: string): { meta: ArticleMeta; content: string } {
  console.log('Parsing content, first 200 chars:', content.substring(0, 200));
  
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    console.error('No front matter found. Content preview:', content.substring(0, 500));
    throw new Error('Invalid markdown format: missing front matter');
  }

  const frontMatter = match[1];
  const markdownContent = match[2];
  
  console.log('Front matter found:', frontMatter);
  
  // Parse YAML-like front matter
  const meta: Partial<ArticleMeta> = {};
  frontMatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      if (key.trim() === 'tags') {
        meta[key.trim() as keyof ArticleMeta] = value.split(',').map(tag => tag.trim()) as any;
      } else {
        meta[key.trim() as keyof ArticleMeta] = value as any;
      }
    }
  });

  console.log('Parsed meta:', meta);

  return {
    meta: meta as ArticleMeta,
    content: markdownContent
  };
}

// Convertit le markdown en HTML (version simplifiée)
function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/```(\w+)?\n([\s\S]*?)\n```/gim, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/gim, '')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gims, '<ol>$1</ol>')
    .replace(/<\/ol>\s*<ol>/gim, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/^(?!<[h|u|o|l|p|c])/gim, '<p>')
    .replace(/$/gim, '</p>')
    .replace(/<p><\/p>/gim, '')
    .replace(/<p>(<[h|u|o|l])/gim, '$1')
    .replace(/(<\/[h|u|o|l].*>)<\/p>/gim, '$1');
}

// Charge un article depuis le filesystem
async function loadArticleFromFile(filePath: string, slug: string, category: string): Promise<Article> {
  try {
    console.log(`Loading article from: ${filePath}`);
    const response = await fetch(filePath);
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load article: ${filePath} (${response.status})`);
    }
    
    const content = await response.text();
    console.log(`Content length: ${content.length}`);
    
    const { meta, content: markdownContent } = parseFrontMatter(content);
    const htmlContent = markdownToHtml(markdownContent);
    
    // Récupérer les informations de l'auteur
    const author = await getAuthorById(meta.author);
    const authorName = author ? author.fullName : meta.author;
    
    const article = {
      ...meta,
      author: authorName,
      id: slug,
      slug,
      content: htmlContent,
      filePath,
      category: meta.category || CATEGORIES[category]?.name || category
    };
    
    console.log(`Successfully loaded article: ${article.title}`);
    return article;
  } catch (error) {
    console.error(`Erreur lors du chargement de l'article ${slug}:`, error);
    throw error;
  }
}

// Initialise le cache des articles
async function initializeCache(): Promise<void> {
  if (cacheInitialized) return;
  
  console.log('Initializing articles cache...');
  const articles: Article[] = [];
  
  for (const articleInfo of STATIC_ARTICLES) {
    try {
      const article = await loadArticleFromFile(
        articleInfo.filePath, 
        articleInfo.slug, 
        articleInfo.category
      );
      articles.push(article);
    } catch (error) {
      console.error(`Erreur lors du chargement de l'article ${articleInfo.slug}:`, error);
    }
  }
  
  articlesCache = articles;
  cacheInitialized = true;
  
  console.log(`Cache initialized with ${articles.length} articles:`, articles.map(a => a.title));
  
  // Met à jour le compteur de catégories
  Object.keys(CATEGORIES).forEach(categorySlug => {
    CATEGORIES[categorySlug].count = articlesCache.filter(
      article => article.category.toLowerCase() === categorySlug
    ).length;
  });
}

// API publique
export async function getAllArticles(): Promise<Article[]> {
  await initializeCache();
  return [...articlesCache];
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  await initializeCache();
  return articlesCache.find(article => article.slug === slug);
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  await initializeCache();
  return articlesCache.filter(
    article => article.category.toLowerCase() === categorySlug
  );
}

export async function searchArticles(query: string): Promise<Article[]> {
  await initializeCache();
  const lowercaseQuery = query.toLowerCase();
  
  return articlesCache.filter(article => 
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.excerpt.toLowerCase().includes(lowercaseQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    article.content.toLowerCase().includes(lowercaseQuery)
  );
}

export function getCategories(): CategoryInfo[] {
  return Object.values(CATEGORIES);
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES[slug];
}
