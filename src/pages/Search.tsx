
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';
import PaginationComponent from '../components/PaginationComponent';
import { Article } from '../types/article';
import { searchArticles } from '../services/articleService';
import { usePagination } from '../hooks/usePagination';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const query = searchParams.get('q') || '';
  const currentPageFromUrl = parseInt(searchParams.get('page') || '1', 10);

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedResults,
    setCurrentPage
  } = usePagination({ items: results, itemsPerPage: 10 });

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  // Synchroniser la page avec l'URL
  useEffect(() => {
    if (currentPageFromUrl !== currentPage) {
      setCurrentPage(currentPageFromUrl);
    }
  }, [currentPageFromUrl, currentPage, setCurrentPage]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const searchResults = await searchArticles(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    const newParams = new URLSearchParams();
    if (searchQuery) {
      newParams.set('q', searchQuery);
    }
    // Reset page when new search
    newParams.delete('page');
    setSearchParams(newParams);
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Section de recherche */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Rechercher</h1>
          <p className="text-xl text-blue-100 mb-8">
            Trouvez les articles qui vous intéressent
          </p>
          
          <SearchBar 
            onSearch={handleSearch}
            results={[]}
            isLoading={false}
            className="max-w-md mx-auto"
          />
          
          {hasSearched && (
            <div className="mt-6 text-blue-100">
              {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''} pour "{query}"
              {totalPages > 1 && (
                <span className="ml-4">• Page {currentPage} sur {totalPages}</span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Résultats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Recherche en cours...</p>
          </div>
        ) : hasSearched ? (
          <>
            {paginatedResults.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {paginatedResults.map((article) => (
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
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-600">
                  Essayez avec d'autres mots-clés ou explorez nos catégories.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Commencez votre recherche
            </h3>
            <p className="text-gray-600">
              Tapez quelques mots-clés pour trouver les articles qui vous intéressent.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Search;
