
import React from 'react';
import { Author } from '../types/author';
import { User, Twitter, Linkedin, Github } from 'lucide-react';

interface AuthorCardProps {
  author: Author;
  className?: string;
}

const AuthorCard = ({ author, className = '' }: AuthorCardProps) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {author.avatar ? (
            <img 
              src={author.avatar} 
              alt={author.fullName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {author.fullName}
          </h3>
          <p className="text-sm text-blue-600 font-medium mb-1">
            {author.role}
          </p>
          <p className="text-sm text-gray-500 mb-3">
            {author.company}
          </p>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {author.bio}
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-3">
            {author.social.twitter && (
              <a
                href={`https://twitter.com/${author.social.twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {author.social.linkedin && (
              <a
                href={`https://linkedin.com/in/${author.social.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {author.social.github && (
              <a
                href={`https://github.com/${author.social.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;
