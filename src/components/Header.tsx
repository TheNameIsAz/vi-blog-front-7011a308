
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PenTool, Home, User, Search, ChevronDown } from 'lucide-react';
import { getCategories } from '../services/articleService';
import { CategoryInfo } from '../types/article';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  useEffect(() => {
    const loadCategories = async () => {
      const cats = getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  const handleSearchClick = () => {
    navigate('/search');
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            <PenTool className="h-6 w-6" />
            <span>ViBlog</span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-blue-600 ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Accueil</span>
            </Link>

            {/* Menu déroulant Catégories */}
            <div className="relative">
              <button 
                onMouseEnter={() => setShowCategoriesMenu(true)}
                onMouseLeave={() => setShowCategoriesMenu(false)}
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <span>Catégories</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showCategoriesMenu && (
                <div 
                  className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                  onMouseEnter={() => setShowCategoriesMenu(true)}
                  onMouseLeave={() => setShowCategoriesMenu(false)}
                >
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      to={`/category/${category.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.name}</span>
                        <span className="text-xs text-gray-500">{category.count}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/about" 
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-blue-600 ${
                isActive('/about') ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              <User className="h-4 w-4" />
              <span>À propos</span>
            </Link>
            
            <button 
              onClick={handleSearchClick}
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-blue-600 ${
                location.pathname.startsWith('/search') ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Rechercher</span>
            </button>
          </nav>
          
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
