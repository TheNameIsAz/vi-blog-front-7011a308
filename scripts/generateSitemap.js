
import { writeFileSync } from 'fs';
import { join } from 'path';

// Configuration pour la génération du sitemap en production
const BASE_URL = 'https://yoursite.lovable.app'; // À remplacer par votre domaine

// Articles statiques pour la génération du sitemap
const STATIC_ARTICLES = [
  'tendances-dev-2024',
  'design-system-guide',
  'vscode-extensions-2024',
  'securite-web-2024'
];

const CATEGORIES = ['developpement', 'design', 'outils', 'securite'];

function generateSitemap() {
  const now = new Date().toISOString().split('T')[0];
  const urls = [];

  // Pages principales
  urls.push({
    loc: `${BASE_URL}/`,
    lastmod: now,
    changefreq: 'daily',
    priority: '1.0'
  });

  urls.push({
    loc: `${BASE_URL}/about`,
    lastmod: now,
    changefreq: 'monthly',
    priority: '0.8'
  });

  urls.push({
    loc: `${BASE_URL}/search`,
    lastmod: now,
    changefreq: 'weekly',
    priority: '0.7'
  });

  // Catégories
  CATEGORIES.forEach(category => {
    urls.push({
      loc: `${BASE_URL}/category/${category}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.8'
    });
  });

  // Articles
  STATIC_ARTICLES.forEach(slug => {
    urls.push({
      loc: `${BASE_URL}/article/${slug}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: '0.9'
    });
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

// Génération et sauvegarde du sitemap
try {
  const sitemapContent = generateSitemap();
  const outputPath = join(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(outputPath, sitemapContent);
  console.log(`✅ Sitemap généré avec succès : ${outputPath}`);
} catch (error) {
  console.error('❌ Erreur lors de la génération du sitemap:', error);
  process.exit(1);
}
