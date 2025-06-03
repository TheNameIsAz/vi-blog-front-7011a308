
import { useEffect, useState } from 'react';
import { generateSitemap } from '../services/sitemapService';

const Sitemap = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');

  useEffect(() => {
    const loadSitemap = async () => {
      try {
        const content = await generateSitemap();
        setSitemapContent(content);
      } catch (error) {
        console.error('Erreur lors de la génération du sitemap:', error);
        setSitemapContent('Erreur lors de la génération du sitemap');
      }
    };

    loadSitemap();
  }, []);

  // Définir le type de contenu comme XML
  useEffect(() => {
    document.title = 'Sitemap';
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '20px' }}>
      {sitemapContent}
    </div>
  );
};

export default Sitemap;
