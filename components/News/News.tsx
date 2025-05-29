"use client"
import React, { useState, useEffect } from 'react';
import { useGetNewsArticlesQuery } from '../../store/services/newsApi';
import NewsCard from './NewsCard';
import NewsDetailModal from './NewsDetailModal';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { Article } from '../../store/services/newsApi';
// No need for useDebounce here if search is triggered by button

const NEWS_PAGE_SIZE = 20;

const News: React.FC = () => {
  const [inputSearchTerm, setInputSearchTerm] = useState<string>(''); // Value in the text box
  const [activeQuery, setActiveQuery] = useState<string>('latest'); // Query used for API
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const {
    data: newsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useGetNewsArticlesQuery({ query: activeQuery, page: currentPage, pageSize: NEWS_PAGE_SIZE });

  // When activeQuery changes (due to search button), reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [activeQuery]);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearchTerm(event.target.value);
  };

  const handleExecuteSearch = () => {
    setActiveQuery(inputSearchTerm.trim() || 'latest'); // Use input or default to 'latest'
  };

  const handleViewDetails = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  const totalPages = newsData ? Math.ceil(newsData.totalResults / NEWS_PAGE_SIZE) : 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">News Headlines</h2>
      </div>

      {/* Search Bar */}
      <div className="form-control max-w-lg mx-auto">
        <div className="join">
          <input
            type="text"
            placeholder="Search news (e.g., 'technology')..."
            value={inputSearchTerm}
            onChange={handleSearchInputChange}
            onKeyDown={(e) => { if (e.key === 'Enter') handleExecuteSearch();}}
            className="input input-bordered join-item w-full"
          />
          <button
            className="btn btn-primary join-item"
            onClick={handleExecuteSearch}
            disabled={isFetching || isLoading}
          >
            Search
          </button>
        </div>
      </div>

      {/* ... rest of the News component remains the same */}
      {(isLoading || isFetching) && <LoadingSpinner />}
      {isError && <ErrorMessage message={(error as any)?.data?.message || 'Failed to load news articles.'} onRetry={() => refetch()} />}

      {newsData && newsData.articles && newsData.articles.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.articles.map((article, index) => (
              <NewsCard key={`${article.url}-${article.publishedAt}-${index}`} article={article} onViewDetails={handleViewDetails} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="join flex justify-center mt-8">
              <button
                className="join-item btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isLoading || isFetching}
              >
                « Previous
              </button>
              <button className="join-item btn">
                Page {currentPage} of {totalPages}
              </button>
              <button
                className="join-item btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || isLoading || isFetching}
              >
                Next »
              </button>
            </div>
          )}
        </>
      )}

      {newsData && newsData.articles && newsData.articles.length === 0 && !isLoading && !isFetching && (
        <p className="text-center text-gray-500 mt-8">No news articles found for your search.</p>
      )}

      {selectedArticle && (
        <NewsDetailModal article={selectedArticle} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default News;