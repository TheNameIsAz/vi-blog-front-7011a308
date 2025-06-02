
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';
import { Article } from '../types/article';
import { searchArticles } from '../services/articleService';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

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
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
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
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Résultats pour "{query}"
              </h2>
              <p className="text-gray-600">
                {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
              </p>
            </div>
            
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((article) => (
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
