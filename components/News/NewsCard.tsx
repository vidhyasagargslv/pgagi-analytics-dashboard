import React from 'react';
import { motion } from 'framer-motion';
import { Article } from '../../store/services/newsApi'; 

interface NewsCardProps {
  article: Article;
  onViewDetails: (article: Article) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onViewDetails }) => {
  const { title, description, urlToImage, source, publishedAt } = article;
  const placeholderImage = "https://via.placeholder.com/400x200.png?text=No+Image";


  return (
    <motion.div
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(80,80,200,0.15)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card card-compact w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow ease-in-out duration-300"
    >
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
    </motion.div>
  );
};

export default NewsCard;