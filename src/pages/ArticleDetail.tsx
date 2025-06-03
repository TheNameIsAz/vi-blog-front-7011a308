import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Bookmark, Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthorCard from '../components/AuthorCard';
import { Article } from '../types/article';
import { Author } from '../types/author';
import { getArticleBySlug } from '../services/articleService';
import { getAuthorById } from '../services/authorService';

const ArticleDetail = () => {
  const { categorySlug, articleSlug } = useParams<{ categorySlug: string; articleSlug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      if (!articleSlug) return;
      
      setIsLoading(true);
      try {
        const foundArticle = await getArticleBySlug(articleSlug);
        setArticle(foundArticle || null);
        
        // Charger les informations de l'auteur si l'article existe
        if (foundArticle) {
          // Extraire l'ID de l'auteur depuis le front matter de l'article
          const response = await fetch(foundArticle.filePath);
          const content = await response.text();
          const frontMatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
          
          if (frontMatterMatch) {
            const frontMatter = frontMatterMatch[1];
            const authorMatch = frontMatter.match(/author:\s*(.+)/);
            if (authorMatch) {
              const authorId = authorMatch[1].trim();
              const authorData = await getAuthorById(authorId);
              setAuthor(authorData || null);
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'article:', error);
        setArticle(null);
        setAuthor(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [articleSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
          <p className="text-gray-600 mb-8">L'article que vous cherchez n'existe pas ou a été supprimé.</p>
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
      
      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux articles</span>
          </Link>
        </nav>

        {/* Article Meta */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <span className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
              {article.category}
            </span>
            {article.tags.map((tag) => (
              <Link
                key={tag}
                to={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {article.excerpt}
          </p>
          
          {/* Author and Meta Info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-8 border-b border-gray-200">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{article.author}</p>
                  <p className="text-sm text-gray-500">Auteur</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{article.publishDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Share2 className="h-4 w-4" />
                <span className="text-sm">Partager</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Heart className="h-4 w-4" />
                <span className="text-sm">J'aime</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                <Bookmark className="h-4 w-4" />
                <span className="text-sm">Sauvegarder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Article Image */}
        <div className="mb-12">
          <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
            {article.image ? (
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-8xl font-bold text-blue-200">
                {article.title.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-relaxed [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mt-8 [&>h1]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:mb-4 [&>p]:text-gray-700 [&>p]:leading-relaxed [&>ul]:mb-4 [&>li]:mb-2 [&>ol]:mb-4 [&>code]:bg-gray-100 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>pre]:bg-gray-900 [&>pre]:text-white [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-4 [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>a]:text-blue-600 [&>a]:underline [&>a]:hover:text-blue-800"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Article Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center space-x-2 mb-6">
            <Tag className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500 mr-2">Tags:</span>
            {article.tags.map((tag) => (
              <Link
                key={tag}
                to={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
          
          {/* Author Section */}
          {author && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">À propos de l'auteur</h3>
              <AuthorCard author={author} />
            </div>
          )}
          
          {/* Share Section */}
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cet article vous a plu ?</h3>
            <p className="text-gray-600 mb-4">Partagez-le avec vos collègues et amis !</p>
            <div className="flex justify-center space-x-3">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Partager sur Twitter
              </button>
              <button className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors">
                Partager sur LinkedIn
              </button>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
