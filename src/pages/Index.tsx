import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ArticleCard from '../components/ArticleCard';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import { TrendingUp, Clock, Star, Grid3x3, Tag } from 'lucide-react';
import { Article } from '../types/article';
import { getAllArticles, searchArticles, getCategories } from '../services/articleService';
import { getArticleUrl, getCategoryUrl } from '../utils/slugUtils';

const Index = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = getCategories();

  useEffect(() => {
    const loadArticles = async () => {
      try {
        console.log('Loading articles...');
        const allArticles = await getAllArticles();
        console.log('Articles loaded:', allArticles.length, allArticles);
        setArticles(allArticles);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
      }
    };
    
    loadArticles();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchArticles(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const featuredArticle = articles[0];
  const recentArticles = articles.slice(1);

  const filteredArticles = selectedCategory === 'all' 
    ? recentArticles 
    : recentArticles.filter(article => 
        article.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      );

  console.log('Index - Render state:', {
    totalArticles: articles.length,
    featuredArticle: featuredArticle?.title,
    recentArticles: recentArticles.length,
    filteredArticles: filteredArticles.length,
    selectedCategory
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section *
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Explorez le monde du
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> développement</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Découvrez les dernières tendances, tutoriels et conseils pour devenir un développeur d'exception
            </p>
            
            {/* Search Bar * /}
            <div className="max-w-md mx-auto mb-8">
              <SearchBar 
                onSearch={handleSearch}
                results={searchResults}
                isLoading={isSearching}
              />
            </div>
            
            {/* Stats * /}
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>{articles.length} articles</span>
              </div>
              <div className="flex items-center space-x-2">
                <Grid3x3 className="h-4 w-4" />
                <span>{categories.length} catégories</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Mis à jour quotidiennement</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Contenu premium</span>
              </div>
            </div>
          </div>
        </div>
      </section>*/}
      <section className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <img src="/assets/img/logo-notxt.png" alt="Logo La Commu'" className="h-16 w-auto mx-auto mb-4" />
            {/* Nom & Branding */}
            <div className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight">
              <p className="mb-2">Bienvenue sur</p>
              <h1>
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  La Commu'
                </span>
                
              </h1>
              </div>
            {/* <p className="text-base md:text-lg text-blue-100 mb-6">
              Un regard à la croisée des usages numériques, des tendances et de la technologie
            </p> */}
            <p className="text-base md:text-lg text-blue-300 mb-6">
            ~
            </p>

            {/* Accroche éditorialisée */}
            <h2 className="text-2xl md:text-4xl font-bold mb-6 leading-tight">
              <span>
                Comparatifs, conseils et sélections pour mieux s’équiper
              </span>
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                tech, apps, outils numériques, services en ligne
              </span>
            </h2>

            {/* Barre de recherche */}
            <div className="max-w-md mx-auto mb-8">
              <SearchBar 
                onSearch={handleSearch}
                results={searchResults}
                isLoading={isSearching}
              />
            </div>

            {/* Call to action */}
            <div className="flex justify-center gap-4 mt-2 mb-10">
              <Link to="/articles" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                Découvrir les articles
              </Link>
              <Link to="/categories" className="px-6 py-3 border border-white/30 hover:border-white text-white font-semibold rounded-lg transition">
                Explorer les sujets
              </Link>
            </div>

            {/* Statistiques */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/80 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl max-w-3xl mx-auto">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>{articles.length} articles</span>
              </div>
              <div className="flex items-center space-x-2">
                <Grid3x3 className="h-4 w-4" />
                <span>{categories.length} catégories</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Actualisé régulièrement</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Sélection du moment</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Featured Article */}
      {featuredArticle && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                  {featuredArticle.image ? (
                    <img 
                      src={`/assets/img/${featuredArticle.image}`}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl font-bold text-blue-200">
                      {featuredArticle.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                    Article featured
                  </span>
                  <Link
                    to={getCategoryUrl(featuredArticle.category)}
                    className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {featuredArticle.category}
                  </Link>
                </div>
                <Link to={getArticleUrl(featuredArticle.category, featuredArticle.slug)}>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
                    {featuredArticle.title}
                  </h2>
                </Link>
                <p className="text-gray-600 mb-6">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Par {featuredArticle.author} • {featuredArticle.publishDate}
                  </div>
                  <div className="text-sm text-gray-500">
                    {featuredArticle.readTime} de lecture
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Articles récents</h2>
          <div className="flex items-center space-x-4">
            <Tag className="h-4 w-4 text-gray-500" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {articles.length === 0 ? 'Chargement des articles...' : 'Aucun article dans cette catégorie'}
            </h3>
            <p className="text-gray-600">
              {articles.length === 0 ? 'Veuillez patienter.' : 'Revenez bientôt pour découvrir de nouveaux contenus !'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
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
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Index;
