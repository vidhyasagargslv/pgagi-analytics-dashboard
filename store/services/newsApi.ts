import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ArticleSource {
    id: string | null;
    name: string;
}

export interface Article {
    source: ArticleSource;
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

interface NewsApiResponse {
    status: string;
    totalResults: number;
    articles: Article[];
}

interface GetNewsArticlesParams {
    query: string;
    page?: number;
    pageSize?: number;
    category?: string;
    
}

export const newsApi = createApi({
    reducerPath: 'newsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://newsapi.org/v2/', // Standard NewsAPI.org base URL
        prepareHeaders: (headers) => {
            const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
            if (apiKey) {
                
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getNewsArticles: builder.query<NewsApiResponse, GetNewsArticlesParams>({
            query: ({ query, page = 1, pageSize = 10, category }) => {
                const params: Record<string, string | number> = {
                    q: query || 'latest', // 'q' is mandatory, default if empty
                    apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY || '',
                    page,
                    pageSize,
                };
                if (category) { // For top-headlines, if we switch endpoint
                    params.category = category;
                }
                
                return {
                    url: 'everything', // or 'top-headlines' if using categories
                    params,
                };
            },
            
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                
                const { page, ...stableQueryArgs } = queryArgs;
                return `${endpointName}-${JSON.stringify(stableQueryArgs)}`;
            },
            merge: (currentCache, newItems, { arg }) => {
                if (arg.page && arg.page > 1) {
                    currentCache.articles.push(...newItems.articles);
                    currentCache.totalResults = newItems.totalResults; // Update total results
                } else {
                    
                    return newItems;
                }
            },
        }),
    }),
});

export const { useLazyGetNewsArticlesQuery, useGetNewsArticlesQuery } = newsApi;