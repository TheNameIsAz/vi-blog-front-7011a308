
import { useEffect } from 'react';
import { saveSitemapToPublic } from '../services/sitemapService';

export function useSitemapGenerator() {
  useEffect(() => {
    // Générer le sitemap au chargement initial
    if (import.meta.env.DEV) {
      saveSitemapToPublic();
    }
  }, []);

  const regenerateSitemap = async () => {
    await saveSitemapToPublic();
  };

  return { regenerateSitemap };
}
