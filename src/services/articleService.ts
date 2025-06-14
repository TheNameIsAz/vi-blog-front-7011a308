import { Article, ArticleMeta, CategoryInfo } from '../types/article';
import { getAuthorById } from './authorService';
import { normalizeSlug } from '../utils/slugUtils';

// Configuration des catégories
const CATEGORIES: Record<string, CategoryInfo> = {};

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
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
// Convertit le markdown en HTML (version simplifiée)
function markdownToHtml(markdown: string): string {
  // Basic markdown to HTML
  let html = markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
    .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/```(\w+)?\n([\s\S]*?)\n```/gim, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/gim, '')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gims, '<ol>$1</ol>')
    .replace(/<\/ol>\s*<ol>/gim, '')
    .replace(/^(?!<[h|u|o|l|p|c])/gim, '<p>')
    .replace(/$/gim, '</p>')
    .replace(/<p><\/p>/gim, '')
    .replace(/<p>(<[h|u|o|l])/gim, '$1')
    .replace(/(<\/[h|u|o|l].*>)<\/p>/gim, '$1');

  // Inject anchor links into headings
  html = html.replace(/<h([2-6])>(.*?)<\/h\1>/g, (match, level, content) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    const slug = plainText.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');

    return `
      <h${level} id="${slug}" class="group relative transition-colors duration-200">
        <span>${plainText}</span>
        <button 
          onclick="
            navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#${slug}');
            const tooltip = document.createElement('div');
            tooltip.textContent = 'Copié !';
            tooltip.className = 'ml-2 text-xs bg-blue-600 text-white px-2 py-1 w-16 rounded absolute';
            tooltip.style.top = '-1.5rem';
            tooltip.style.right = '-1.5rem';
            this.appendChild(tooltip);
            setTimeout(() => tooltip.remove(), 1500);
          "
          class="ml-2 inline-block opacity-0 group-hover:opacity-100  hover:text-blue-600 transition-opacity text-inherit relative"
          aria-label="Copier le lien"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" class="inline-block w-4 h-4 text-inherit align-text-bottom" fill="currentColor">
    <g>
      <path d="M20.437 2.69c-3.37 0-5.778 3.05-8.186 5.297.322 0 .804-.16 1.285-.16.803 0 1.605.16 2.408.48 1.284-1.283 2.568-2.727 4.494-2.727.963 0 2.087.48 2.89 1.123 1.605 1.605 1.605 4.174 0 5.78l-4.174 4.172c-.642.642-1.926 1.124-2.89 1.124-2.246 0-3.37-1.446-4.172-3.212l-2.086 2.087c1.284 2.408 3.21 4.173 6.1 4.173 1.926 0 3.69-.802 4.815-2.086l4.172-4.174c1.445-1.444 2.408-3.21 2.408-5.297-.32-3.53-3.53-6.58-7.063-6.58z"/>
      <path d="M13.535 22.113l-1.444 1.444c-.64.642-1.925 1.124-2.89 1.124-.962 0-2.085-.48-2.888-1.123-1.605-1.605-1.605-4.334 0-5.778l4.174-4.175c.642-.642 1.926-1.123 2.89-1.123 2.246 0 3.37 1.605 4.172 3.21l2.087-2.087c-1.284-2.407-3.21-4.173-6.1-4.173-1.926 0-3.692.803-4.815 2.087L4.547 15.69c-2.73 2.73-2.73 7.063 0 9.63 2.568 2.57 7.062 2.73 9.47 0l3.05-3.05c-.482.162-.963.162-1.445.162-.803 0-1.445 0-2.087-.32z"/>
    </g>
  </svg>
        </button>
      </h${level}>
    `;
  });

  return html;
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
  const files = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default', eager: true });

  if (cacheInitialized) return;
  
  console.log('Initializing articles cache...');
  const articles: Article[] = [];
  
  for (const fullPath in files) {
    try {
      const content = files[fullPath];
      const parts = fullPath.split('/');
      const categorySlug = parts[2];
      const filename = parts[3].replace('.md', '');
  
      const { meta, content: mdContent } = parseFrontMatter(content);
      const htmlContent = markdownToHtml(mdContent);
      const author = await getAuthorById(meta.author);
      const authorName = author ? author.fullName : meta.author;
  
      const article: Article = {
        ...meta,
        author: authorName,
        id: filename,
        slug: filename,
        content: htmlContent,
        filePath: fullPath,
        category: meta.category || categorySlug
      };
  
      articles.push(article);
  
      // Ajout automatique dans CATEGORIES
      const catSlug = normalizeSlug(article.category);
      if (!CATEGORIES[catSlug]) {
        CATEGORIES[catSlug] = {
          name: article.category,
          slug: catSlug,
          description: '',
          count: 1
        };
      } else {
        CATEGORIES[catSlug].count++;
      }
  
    } catch (err) {
      console.error(`Erreur chargement ${fullPath}`, err);
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

export async function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  await initializeCache();
  return CATEGORIES[slug];
}
