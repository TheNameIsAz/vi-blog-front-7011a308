
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Article } from '../types/article';

interface SearchBarProps {
  onSearch: (query: string) => void;
  results: Article[];
  isLoading: boolean;
  className?: string;
}

const SearchBar = ({ onSearch, results, isLoading, className = '' }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    onSearch('');
  };

  const handleResultClick = () => {
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Rechercher un article..."
          className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Résultats de recherche */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Recherche en cours...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((article) => (
                <a
                  key={article.id}
                  href={`/article/${article.slug}`}
                  onClick={handleResultClick}
                  className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <h4 className="font-medium text-gray-900 mb-1">{article.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full mr-2">
                      {article.category}
                    </span>
                    <span>{article.author} • {article.publishDate}</span>
                  </div>
                </a>
              ))}
            </div>
          ) : query.length > 0 ? (
            <div className="p-4 text-center text-gray-500">
              Aucun résultat trouvé pour "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
