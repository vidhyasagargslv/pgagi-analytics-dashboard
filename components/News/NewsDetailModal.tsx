import React from 'react';
import { Article } from '../../store/services/newsApi'; // Adjust path

interface NewsDetailModalProps {
  article: Article | null;
  onClose: () => void;
}

const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <dialog id="news_detail_modal" className="modal modal-open">
      <div className="modal-box w-11/12 max-w-3xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
        </form>
        <h3 className="font-bold text-2xl mb-4">{article.title}</h3>
        {article.urlToImage && (
            <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-auto max-h-96 object-contain rounded-md mb-4"
                onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails
            />
        )}
        <p className="text-sm text-gray-500 mb-1">
          By: {article.author || article.source.name || 'Unknown'} | Published: {new Date(article.publishedAt).toLocaleString()}
        </p>
        <p className="py-4 whitespace-pre-wrap">
            {article.content || article.description || "No further content available. Please visit the source for more details."}
        </p>
        <div className="modal-action">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Read Full Article
            </a>
            <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
       {/* Optional: Click outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default NewsDetailModal;