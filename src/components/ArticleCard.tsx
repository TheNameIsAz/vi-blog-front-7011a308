
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { getArticleUrl, getCategoryUrl } from '../utils/slugUtils';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  image?: string;
}

const ArticleCard = ({ 
  id, 
  title, 
  excerpt, 
  author, 
  publishDate, 
  readTime, 
  category,
  image 
}: ArticleCardProps) => {
  // Utiliser les fonctions utilitaires pour générer les URLs
  const articleUrl = getArticleUrl(category, id);
  const categoryUrl = getCategoryUrl(category);

  console.log('ArticleCard - Creating URL:', { category, id, articleUrl, categoryUrl });

  return (
    <article className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        {image ? (
          <img 
            src={`/assets/img/${image}`} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl font-bold text-blue-200">
              {title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Link
            to={categoryUrl}
            className="bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-medium px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
          >
            {category}
          </Link>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {excerpt}
        </p>
        
        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{readTime}</span>
            </div>
          </div>
          <span className="font-medium text-gray-700">{author}</span>
        </div>
        
        {/* Read more link */}
        <Link 
          to={articleUrl}
          className="inline-flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-700 transition-colors group"
        >
          <span>Lire la suite</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;
