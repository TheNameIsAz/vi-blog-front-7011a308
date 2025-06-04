
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { exec } from "child_process";

// Plugin personnalisé pour générer le sitemap
const sitemapPlugin = () => {
  return {
    name: 'sitemap-generator',
    buildStart() {
      // Générer le sitemap au début du build
      exec('node scripts/generateSitemap.js', (error, stdout, stderr) => {
        if (error) {
          console.error('Erreur génération sitemap:', error);
          return;
        }
        console.log(stdout);
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    mode === 'production' && sitemapPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
