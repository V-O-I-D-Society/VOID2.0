import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogPostCard({ post }) {
  // Destructure the post object for easier access
  const { author, authorAvatar, title, snippet, imageUrl, date, readTime, tags } = post;

  return (
    <article className="flex flex-col sm:flex-row gap-6 w-full group">
      {/* Content Section */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          {/* Letter Avatar */}
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
            authorAvatar === 'S' ? 'bg-blue-600' :
            authorAvatar === 'A' ? 'bg-green-600' :
            authorAvatar === 'P' ? 'bg-purple-600' :
            'bg-gray-600'
          }`}>
            {authorAvatar}
          </div>
          <span className="text-sm font-medium text-gray-200">{author}</span>
        </div>
        <Link to={`/blogs/${post.id}`} state={{ post }} className="block">
          <h2 className="text-2xl font-bold text-white group-hover:text-blue-300 group-hover:underline font-serif transition-colors">{title}</h2>
          <p className="mt-2 text-gray-400 text-base leading-relaxed hidden md:block">
            {snippet}
          </p>
        </Link>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span>{date} · {readTime}</span>
            {tags && tags.length > 0 && (
              <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full hidden sm:block border border-gray-700">
                {tags[0]}
              </span>
            )}
          </div>
          {/* You can add icons for likes/comments here */}
        </div>
      </div>

      {/* Image Section */}
      <Link to={`/blogs/${post.id}`} state={{ post }} className="sm:w-48 sm:h-32 flex-shrink-0 group">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover rounded-lg group-hover:opacity-80 transition-opacity" 
        />
      </Link>
    </article>
  );
}