
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import PaginationComponent from '../components/PaginationComponent';
import { Article, CategoryInfo } from '../types/article';
import { getArticlesByCategory, getCategoryBySlug } from '../services/articleService';
import { usePagination } from '../hooks/usePagination';

const Category = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<CategoryInfo | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [isLoading, setIsLoading] = useState(true);

  const currentPageFromUrl = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    const loadCategoryData = async () => {
      if (!categorySlug) return;
      
      setIsLoading(true);
      console.log('Loading category:', categorySlug);
      
      try {
        // Essayer de charger la catégorie et ses articles
        const categoryInfo = getCategoryBySlug(categorySlug);
        console.log('Category info found:', categoryInfo);
        
        if (!categoryInfo) {
          console.log('No category found for slug:', categorySlug);
          setCategory(null);
          setArticles([]);
          setIsLoading(false);
          return;
        }
        
        const categoryArticles = await getArticlesByCategory(categorySlug);
        console.log('Articles found:', categoryArticles.length);
        
        setCategory(categoryInfo);
        setArticles(categoryArticles);
      } catch (error) {
        console.error('Erreur lors du chargement de la catégorie:', error);
        setCategory(null);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryData();
  }, [categorySlug]);

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedArticles,
    setCurrentPage
  } = usePagination({ items: sortedArticles, itemsPerPage: 10 });

  // Synchroniser la page avec l'URL
  useEffect(() => {
    if (currentPageFromUrl !== currentPage) {
      setCurrentPage(currentPageFromUrl);
    }
  }, [currentPageFromUrl, currentPage, setCurrentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (page === 1) {
        newParams.delete('page');
      } else {
        newParams.set('page', page.toString());
      }
      return newParams;
    });
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    console.log('Rendering 404 - no category found');
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Catégorie non trouvée</h1>
          <p className="text-gray-600 mb-8">La catégorie "{categorySlug}" n'existe pas.</p>
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header de catégorie */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à l'accueil</span>
            </Link>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
          <p className="text-xl text-blue-100 mb-6">{category.description}</p>
          <div className="flex items-center space-x-6 text-blue-100">
            <span>{articles.length} article{articles.length > 1 ? 's' : ''}</span>
            {totalPages > 1 && (
              <span>Page {currentPage} sur {totalPages}</span>
            )}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {articles.length > 0 && (
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Articles en {category.name}
            </h2>
            <div className="flex items-center space-x-4">
              <Filter className="h-4 w-4 text-gray-500" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Plus récents</option>
                <option value="title">Alphabétique</option>
              </select>
            </div>
          </div>
        )}
        
        {paginatedArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
            
            {totalPages > 1 && (
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="justify-center"
              />
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun article dans cette catégorie
            </h3>
            <p className="text-gray-600">
              Les articles seront bientôt disponibles !
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Category;
