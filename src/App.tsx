
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSitemapGenerator } from "./hooks/useSitemapGenerator";
import Index from "./pages/Index";
import About from "./pages/About";
import ArticleDetail from "./pages/ArticleDetail";
import Category from "./pages/Category";
import Search from "./pages/Search";
import Sitemap from "./pages/Sitemap";
import Tag from "./pages/Tag";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useSitemapGenerator();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/search" element={<Search />} />
      <Route path="/sitemap.xml" element={<Sitemap />} />
      <Route path="/tag/:tagSlug" element={<Tag />} />
      {/* Routes pour catégories - supporter les deux formats pour compatibilité */}
      <Route path="/category/:categorySlug" element={<Category />} />
      <Route path="/:categorySlug" element={<Category />} />
      {/* Route pour les articles avec /{categorySlug}/{articleSlug} */}
      <Route path="/:categorySlug/:articleSlug" element={<ArticleDetail />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
