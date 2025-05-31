"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGetNewsArticlesQuery, useLazyGetNewsArticlesQuery } from '../../store/services/newsApi';
import NewsCard from './NewsCard';
import NewsDetailModal from './NewsDetailModal';  
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { Article } from '../../store/services/newsApi';

const NEWS_PAGE_SIZE = 20;

const News: React.FC = () => {
  const [inputSearchTerm, setInputSearchTerm] = useState<string>(''); // Value in the text box
  const [activeQuery, setActiveQuery] = useState<string>('latest'); // Query used for API
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [hasMoreArticles, setHasMoreArticles] = useState<boolean>(true);
  const observerRef = useRef<HTMLDivElement>(null);
  const {
    data: newsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useGetNewsArticlesQuery({ query: activeQuery, page: currentPage, pageSize: NEWS_PAGE_SIZE });

  const [loadMoreTrigger, { isLoading: isLoadingMore }] = useLazyGetNewsArticlesQuery();

  // When activeQuery changes (due to search button), reset everything
  useEffect(() => {
    setCurrentPage(1);
    setHasMoreArticles(true);
  }, [activeQuery]);
  // Check if we have more articles based on current data
  useEffect(() => {
    if (newsData && newsData.articles) {
      const totalLoaded = newsData.articles.length;
      const hasMore = totalLoaded < newsData.totalResults;
      setHasMoreArticles(hasMore);
    }
  }, [newsData]);

  const loadMoreArticles = useCallback(() => {
    if (hasMoreArticles && !isFetching && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadMoreTrigger({ query: activeQuery, page: nextPage, pageSize: NEWS_PAGE_SIZE });
    }
  }, [activeQuery, currentPage, hasMoreArticles, isFetching, isLoadingMore, loadMoreTrigger]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMoreArticles && !isFetching && !isLoadingMore) {
          loadMoreArticles();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMoreArticles, isFetching, isLoadingMore, loadMoreArticles]);

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

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
          News Headlines
        </h2>
      </div>

      {/* Search Bar */}
      <div className="form-control max-w-screen mx-auto flex justify-center items-center space-x-4 mb-6">
        <div className="join">
          <input
            type="text"
            placeholder="Search news (e.g., 'technology')..."
            value={inputSearchTerm}
            onChange={handleSearchInputChange}
            onKeyDown={(e) => { if (e.key === 'Enter') handleExecuteSearch();}}
            className="input input-bordered join-item w-full"
            disabled={isFetching || isLoading}
            
          />
          <button
            className="btn btn-primary join-item"
            onClick={handleExecuteSearch}
            disabled={isFetching || isLoading}
          >
            Search
          </button>
        </div>
      </div>      {/* Loading and Error States */}
      {(isLoading || isFetching) && <LoadingSpinner />}
      {isError && <ErrorMessage message={(error as any)?.data?.message || 'Failed to load news articles.'} onRetry={() => refetch()} />}

      {newsData && newsData.articles && newsData.articles.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.articles.map((article, index) => (
              <NewsCard key={`${article.url}-${article.publishedAt}-${index}`} article={article} onViewDetails={handleViewDetails} />
            ))}
          </div>

          {/* Infinite scroll loading indicator and trigger */}
          {hasMoreArticles && (
            <div ref={observerRef} className="flex justify-center mt-8">
              {(isFetching || isLoadingMore) ? (
                <LoadingSpinner />
              ) : (
                <button
                  className="btn btn-outline btn-primary"
                  onClick={loadMoreArticles}
                  disabled={isFetching || isLoadingMore}
                >
                  Load More Articles
                </button>
              )}
            </div>
          )}

          {!hasMoreArticles && newsData.articles.length > NEWS_PAGE_SIZE && (
            <div className="text-center mt-8">
              <p className="text-gray-500">You've reached the end of the articles</p>
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