import { Article, ArticleMeta, CategoryInfo } from '../types/article';
import { getAuthorById } from './authorService';
import { normalizeSlug } from '../utils/slugUtils';

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
    filePath: './content/developpement/tendances-dev-2024.md'
  },
  {
    category: 'design',
    slug: 'design-system-guide',
    filePath: './content/design/design-system-guide.md'
  },
  {
    category: 'outils',
    slug: 'vscode-extensions-2024',
    filePath: './content/outils/vscode-extensions-2024.md'
  },
  {
    category: 'securite',
    slug: 'securite-web-2024',
    filePath: './content/securite/securite-web-2024.md'
  }
];

// Cache pour les articles
let articlesCache: Article[] = [];
let cacheInitialized = false;

// Parse le front matter d'un fichier markdown
function parseFrontMatter(content: string): { meta: ArticleMeta; content: string } {
  console.log('Raw content first 100 chars:', JSON.stringify(content.substring(0, 100)));
  
  // Normalize line endings and trim whitespace
  const normalizedContent = content.replace(/\r\n/g, '\n').trim();
  
  // Updated regex to be more flexible with whitespace
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = normalizedContent.match(frontMatterRegex);
  
  if (!match) {
    console.error('Front matter regex failed. Testing alternative patterns...');
    console.log('Content starts with:', normalizedContent.substring(0, 20));
    console.log('Content includes ---?', normalizedContent.includes('---'));
    
    // Try alternative regex patterns
    const altRegex1 = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const altMatch1 = normalizedContent.match(altRegex1);
    
    if (altMatch1) {
      console.log('Alternative regex 1 worked!');
      const frontMatter = altMatch1[1];
      const markdownContent = altMatch1[2];
      return parseMetaAndContent(frontMatter, markdownContent);
    }
    
    throw new Error('Invalid markdown format: missing front matter');
  }

  const frontMatter = match[1];
  const markdownContent = match[2];
  
  return parseMetaAndContent(frontMatter, markdownContent);
}

function parseMetaAndContent(frontMatter: string, markdownContent: string): { meta: ArticleMeta; content: string } {
  console.log('Parsing front matter:', frontMatter);
  
  // Parse YAML-like front matter
  const meta: Partial<ArticleMeta> = {};
  frontMatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    
    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
    
    if (key === 'tags') {
      meta[key as keyof ArticleMeta] = value.split(',').map(tag => tag.trim()) as any;
    } else {
      meta[key as keyof ArticleMeta] = value as any;
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
    
    // Try different path variations for production/development compatibility
    const pathsToTry = [
      filePath,
      filePath.replace('./', '/'),
      filePath.replace('./content/', '/content/'),
      `${import.meta.env.BASE_URL}${filePath.replace('./', '')}`
    ];
    
    let response: Response | null = null;
    let lastError: Error | null = null;
    
    for (const path of pathsToTry) {
      try {
        console.log(`Trying path: ${path}`);
        response = await fetch(path);
        if (response.ok) {
          console.log(`Success with path: ${path}`);
          break;
        } else {
          console.log(`Failed with path: ${path} (${response.status})`);
        }
      } catch (error) {
        console.log(`Error with path: ${path}`, error);
        lastError = error as Error;
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`Failed to load article: ${filePath} (${response?.status || 'network error'}). Last error: ${lastError?.message}`);
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
  
  // Met à jour le compteur de catégories en utilisant la normalisation
  Object.keys(CATEGORIES).forEach(categorySlug => {
    CATEGORIES[categorySlug].count = articlesCache.filter(
      article => normalizeSlug(article.category) === categorySlug
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
    article => normalizeSlug(article.category) === categorySlug
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
