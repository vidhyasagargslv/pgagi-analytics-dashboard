// src/components/News/NewsCard.tsx
import React from 'react';
import { Article } from '../../store/services/newsApi'; // Adjust path

interface NewsCardProps {
  article: Article;
  onViewDetails: (article: Article) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onViewDetails }) => {
  const { title, description, urlToImage, source, publishedAt } = article;
  const placeholderImage = "https://via.placeholder.com/400x200.png?text=No+Image";


  return (
    <div className="card card-compact w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <figure className="h-48 overflow-hidden">
        <img
            src={urlToImage || placeholderImage}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = placeholderImage)}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg leading-tight">
            {title.length > 70 ? `${title.substring(0, 70)}...` : title}
        </h2>
        <p className="text-xs text-gray-500">
          {source.name} - {new Date(publishedAt).toLocaleDateString()}
        </p>
        <p className="text-sm mt-1">
            {description && description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>
        <div className="card-actions justify-end mt-2">
          <button className="btn btn-primary btn-sm" onClick={() => onViewDetails(article)}>
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;