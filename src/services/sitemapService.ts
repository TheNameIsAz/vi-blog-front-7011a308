import { getAllArticles, getCategories } from './articleService';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

const BASE_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'https://yoursite.lovable.app'; // Fallback pour le build

export async function generateSitemap(): Promise<string> {
  console.log('Generating sitemap...');
  
  const urls: SitemapUrl[] = [];
  const now = new Date().toISOString().split('T')[0];

  // Page d'accueil
  urls.push({
    loc: `${BASE_URL}/`,
    lastmod: now,
    changefreq: 'daily',
    priority: '1.0'
  });

  // Page À propos
  urls.push({
    loc: `${BASE_URL}/about`,
    lastmod: now,
    changefreq: 'monthly',
    priority: '0.8'
  });

  // Page de recherche
  urls.push({
    loc: `${BASE_URL}/search`,
    lastmod: now,
    changefreq: 'weekly',
    priority: '0.7'
  });

  try {
    // Catégories
    const categories = getCategories();
    categories.forEach(category => {
      urls.push({
        loc: `${BASE_URL}/category/${category.slug}`,
        lastmod: now,
        changefreq: 'weekly',
        priority: '0.8'
      });
    });

    // Articles avec nouvelle structure d'URL
    const articles = await getAllArticles();
    articles.forEach(article => {
      const categorySlug = article.category.toLowerCase().replace(/\s+/g, '-');
      urls.push({
        loc: `${BASE_URL}/${categorySlug}/${article.slug}`,
        lastmod: now,
        changefreq: 'monthly',
        priority: '0.9'
      });
    });

    // Tags
    const allTags = new Set<string>();
    articles.forEach(article => {
      article.tags.forEach(tag => {
        allTags.add(tag.toLowerCase().replace(/\s+/g, '-'));
      });
    });

    allTags.forEach(tagSlug => {
      urls.push({
        loc: `${BASE_URL}/tag/${tagSlug}`,
        lastmod: now,
        changefreq: 'weekly',
        priority: '0.6'
      });
    });
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error);
  }

  // Génération du XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  console.log(`Sitemap generated with ${urls.length} URLs`);
  return sitemap;
}

export async function saveSitemapToPublic(): Promise<void> {
  try {
    const sitemapContent = await generateSitemap();
    
    // En mode dev, utiliser fetch pour sauvegarder
    if (import.meta.env.DEV) {
      console.log('Sitemap content generated:', sitemapContent.substring(0, 200) + '...');
      // Note: En mode dev, nous ne pouvons pas écrire directement dans le filesystem
      // Le sitemap sera disponible via l'API endpoint
      return;
    }
    
    // En production, le sitemap sera généré pendant le build
    console.log('Sitemap generation completed');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du sitemap:', error);
  }
}
