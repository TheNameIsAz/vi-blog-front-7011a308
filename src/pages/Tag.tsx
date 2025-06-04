
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Tag as TagIcon } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import PaginationComponent from '../components/PaginationComponent';
import { usePagination } from '../hooks/usePagination';
import { Article } from '../types/article';
import { searchArticles } from '../services/articleService';

const Tag = () => {
  const { tagSlug } = useParams<{ tagSlug: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedArticles,
    setCurrentPage
  } = usePagination({
    items: articles,
    itemsPerPage: 6
  });

  useEffect(() => {
    const loadTagArticles = async () => {
      if (!tagSlug) return;
      
      setIsLoading(true);
      try {
        // Rechercher les articles par tag
        const allArticles = await searchArticles(tagSlug);
        // Filtrer pour ne garder que ceux qui ont exactement ce tag
        const taggedArticles = allArticles.filter(article => 
          article.tags.some(tag => 
            tag.toLowerCase().replace(/\s+/g, '-') === tagSlug
          )
        );
        setArticles(taggedArticles);
      } catch (error) {
        console.error('Erreur lors du chargement des articles du tag:', error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTagArticles();
  }, [tagSlug]);

  const formatTagName = (slug: string) => {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <TagIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              {formatTagName(tagSlug || '')}
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            {articles.length} article{articles.length > 1 ? 's' : ''} trouvé{articles.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.slug}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author}
                  publishDate={article.publishDate}
                  readTime={article.readTime}
                  category={article.category}
                  image={article.image}
                />
              ))}
            </div>

            {/* Pagination */}
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-12"
            />
          </>
        ) : (
          <div className="text-center py-16">
            <TagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Aucun article trouvé
            </h2>
            <p className="text-gray-600">
              Aucun article n'a été trouvé pour le tag "{formatTagName(tagSlug || '')}"
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Tag;
