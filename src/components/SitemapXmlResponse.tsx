
import { useEffect } from 'react';
import { generateSitemap } from '../services/sitemapService';

const SitemapXmlResponse = () => {
  useEffect(() => {
    const serveSitemap = async () => {
      try {
        const sitemapContent = await generateSitemap();
        
        // Créer une réponse XML
        const xmlBlob = new Blob([sitemapContent], { 
          type: 'application/xml' 
        });
        
        // Créer un élément temporaire pour télécharger ou afficher
        const url = URL.createObjectURL(xmlBlob);
        
        // Remplacer le contenu de la page
        document.open();
        document.write(sitemapContent);
        document.close();
        
        // Définir le type de contenu
        if (document.contentType) {
          (document as any).contentType = 'application/xml';
        }
        
      } catch (error) {
        console.error('Erreur lors de la génération du sitemap:', error);
        document.open();
        document.write('<error>Erreur lors de la génération du sitemap</error>');
        document.close();
      }
    };

    serveSitemap();
  }, []);

  return null;
};

export default SitemapXmlResponse;
