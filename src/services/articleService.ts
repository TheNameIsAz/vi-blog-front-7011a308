
import { Article, ArticleMeta, CategoryInfo } from '../types/article';

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

// Cache pour les articles
let articlesCache: Article[] = [];
let cacheInitialized = false;

// Parse le front matter d'un fichier markdown
function parseFrontMatter(content: string): { meta: ArticleMeta; content: string } {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    throw new Error('Invalid markdown format: missing front matter');
  }

  const frontMatter = match[1];
  const markdownContent = match[2];
  
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
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/^(?!<[h|u|l])/gim, '<p>')
    .replace(/$/gim, '</p>')
    .replace(/<p><\/p>/gim, '');
}

// Charge les articles depuis le localStorage (simulant le chargement des fichiers)
async function loadArticlesFromStorage(): Promise<Article[]> {
  // En production, ceci serait remplacé par un vrai chargement de fichiers
  // Pour la démo, on utilise des articles exemple
  const sampleArticles = [
    {
      category: 'developpement',
      slug: 'tendances-dev-2024',
      content: `---
title: Les tendances du développement web en 2024
excerpt: Découvrez les technologies et frameworks qui façonnent l'avenir du développement web cette année.
author: Marie Dubois
publishDate: 15 Mai 2024
readTime: 5 min
category: Développement
tags: React, TypeScript, Performance, Tendances
---

# L'évolution constante du développement web

Le monde du développement web ne cesse d'évoluer, et 2024 ne fait pas exception. Cette année marque un tournant important avec l'émergence de nouvelles technologies et l'évolution des pratiques existantes.

## React et l'écosystème moderne

React continue de dominer le paysage du développement frontend, avec des améliorations constantes et un écosystème toujours plus riche. Les Server Components et la nouvelle architecture concurrent mode changent la donne.

## L'essor de TypeScript

TypeScript s'impose comme un standard incontournable, offrant une meilleure expérience de développement et une maintenance facilitée des applications complexes.`
    },
    {
      category: 'design',
      slug: 'design-system-guide',
      content: `---
title: Design System : créer une cohérence visuelle
excerpt: Les étapes clés pour mettre en place un design system efficace dans votre organisation.
author: Alexandre Petit
publishDate: 8 Mai 2024
readTime: 7 min
category: Design
tags: Design System, UI, Composants, Organisation
---

# L'importance d'un Design System

Un design system bien conçu assure la cohérence visuelle et améliore l'efficacité des équipes de développement et de design.

## Composants réutilisables

La création de composants réutilisables permet de maintenir la cohérence tout en accélérant le développement.`
    }
  ];

  const articles: Article[] = [];
  
  for (const sample of sampleArticles) {
    try {
      const { meta, content } = parseFrontMatter(sample.content);
      const htmlContent = markdownToHtml(content);
      
      articles.push({
        ...meta,
        id: sample.slug,
        slug: sample.slug,
        content: htmlContent,
        filePath: `content/${sample.category}/${sample.slug}.md`
      });
    } catch (error) {
      console.error(`Erreur lors du parsing de l'article ${sample.slug}:`, error);
    }
  }

  return articles;
}

// Initialise le cache des articles
async function initializeCache(): Promise<void> {
  if (cacheInitialized) return;
  
  articlesCache = await loadArticlesFromStorage();
  cacheInitialized = true;
  
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
