// src/store/services/newsApi.ts
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
    category?: string; // As per original assignment, good to have
    // Add other NewsAPI params as needed: sources, domains, from, to, language, sortBy
}

export const newsApi = createApi({
    reducerPath: 'newsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://newsapi.org/v2/', // Standard NewsAPI.org base URL
        prepareHeaders: (headers) => {
            const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
            if (apiKey) {
                // NewsAPI.org uses Authorization header or apiKey query param
                // headers.set('Authorization', `Bearer ${apiKey}`);
                // Or it's often passed as a query parameter
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
                // Use 'everything' endpoint for general search with 'q'
                // Or 'top-headlines' if focusing on categories/country
                return {
                    url: 'everything', // or 'top-headlines' if using categories
                    params,
                };
            },
            // For pagination/infinite scroll, we might need to merge results
            // See RTK Query docs on 'merge' and 'serializeQueryArgs' for infinite scroll
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                // Create a stable query key, excluding 'page' for merging
                const { page, ...stableQueryArgs } = queryArgs;
                return `${endpointName}-${JSON.stringify(stableQueryArgs)}`;
            },
            merge: (currentCache, newItems, { arg }) => {
                if (arg.page && arg.page > 1) {
                    currentCache.articles.push(...newItems.articles);
                    currentCache.totalResults = newItems.totalResults; // Update total results
                } else {
                    // This is a new query or the first page
                    return newItems;
                }
            },
        }),
    }),
});

export const { useLazyGetNewsArticlesQuery, useGetNewsArticlesQuery } = newsApi;