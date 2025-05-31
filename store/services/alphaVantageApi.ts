import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// --- Interfaces ---
export interface AlphaVantageSymbolMatch {
    '1. symbol': string;
    '2. name': string;
    '3. type': string;
    '4. region': string;
    '5. marketOpen': string;
    '6. marketClose': string;
    '7. timezone': string;
    '8. currency': string;
    '9. matchScore': string;
}

interface SymbolSearchResponse {
    bestMatches: AlphaVantageSymbolMatch[];
}

// For Time Series data points (Daily, Weekly, Monthly have similar structure)
interface TimeSeriesPointRaw {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
}

// Generic structure for Time Series API responses
interface TimeSeriesApiResponse {
    'Meta Data': {
        '1. Information': string;
        '2. Symbol': string;
        '3. Last Refreshed': string;
        '4. Output Size'?: string;
        '5. Time Zone': string;
    };
    [key: string]: any; 
}

export interface GlobalQuoteData {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string; // Current price
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
}

interface GlobalQuoteApiResponse {
    'Global Quote': GlobalQuoteData;
}

// Transformed chart data structure for charting libraries
export interface ChartDataPoint {
    time: string; // Date string 'YYYY-MM-DD'
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    value?: number; // For line charts (typically close price)
    volume?: number;
}

export type TimeSeriesFunction = 'TIME_SERIES_DAILY' | 'TIME_SERIES_WEEKLY' | 'TIME_SERIES_MONTHLY';

// Helper to get the correct data key from the API response
const getTimeSeriesKey = (apiResponse: TimeSeriesApiResponse): string | undefined => {
    return Object.keys(apiResponse).find(key =>
        key.includes('Time Series') || key.includes('Weekly Time Series') || key.includes('Monthly Time Series')
    );
};

export const alphaVantageApi = createApi({
    reducerPath: 'alphaVantageApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://www.alphavantage.co/',
        prepareHeaders: (headers) => {
            
            return headers;
        },
    }),
    endpoints: (builder) => ({
        searchSymbol: builder.query<AlphaVantageSymbolMatch[], string>({
            query: (keywords) => ({
                url: 'query',
                params: {
                    function: 'SYMBOL_SEARCH',
                    keywords,
                    apikey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY,
                },
            }),
            transformResponse: (response: SymbolSearchResponse) => response.bestMatches || [],
        }),
        getGlobalQuote: builder.query<GlobalQuoteData, string>({
            query: (symbol) => ({
                url: 'query',
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol,
                    apikey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo',
                },
            }),
            transformResponse: (response: GlobalQuoteApiResponse) => response['Global Quote'],
        }),
        getTimeSeries: builder.query<ChartDataPoint[], { symbol: string; timeSeriesFunction: TimeSeriesFunction }>({
            query: ({ symbol, timeSeriesFunction }) => ({
                url: 'query',
                params: {
                    function: timeSeriesFunction,
                    symbol,
                    outputsize: 'compact',
                    apikey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo',
                },
            }),
            transformResponse: (response: TimeSeriesApiResponse, meta, arg): ChartDataPoint[] => {
                const seriesKey = getTimeSeriesKey(response);
                if (!seriesKey || !response[seriesKey]) return [];

                const timeSeriesData = response[seriesKey] as Record<string, TimeSeriesPointRaw>;
                
                return Object.entries(timeSeriesData)
                    .map(([date, values]) => ({
                        time: date,
                        open: parseFloat(values['1. open']),
                        high: parseFloat(values['2. high']),
                        low: parseFloat(values['3. low']),
                        close: parseFloat(values['4. close']),
                        value: parseFloat(values['4. close']),
                        volume: parseInt(values['5. volume'], 10),
                    }))
                    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
            },
        }),
    }),
});

export const {
    useLazySearchSymbolQuery,
    useLazyGetGlobalQuoteQuery,
    useLazyGetTimeSeriesQuery,
} = alphaVantageApi;