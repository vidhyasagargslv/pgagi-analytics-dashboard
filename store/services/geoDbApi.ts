// src/store/services/geoDbApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface GeoDbCity {
    id: number;
    wikiDataId: string;
    type: string;
    city: string; // Or 'name' - the example has both, let's clarify which one to use for display
    name: string; // Using this for display, and 'city' for passing to weather API if different
    country: string;
    countryCode: string;
    region: string;
    regionCode: string;
    latitude: number;
    longitude: number;
    population: number;
}

interface GeoDbApiResponse {
    data: GeoDbCity[];
    links: Array<{ rel: string; href: string }>;
    metadata: {
        currentOffset: number;
        totalCount: number;
    };
}

export const geoDbApi = createApi({
    reducerPath: 'geoDbApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://wft-geo-db.p.rapidapi.com/v1/geo/',
        prepareHeaders: (headers) => {
            const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
            if (apiKey) {
                headers.set('x-rapidapi-key', apiKey);
                // As per the example, but the host might be specific to the key
                // headers.set('x-rapidapi-host', 'wft-geo-db.p.rapidapi.com');
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getCities: builder.query<GeoDbCity[], string>({
            query: (namePrefix) => ({
                url: 'cities',
                params: { limit: 5, namePrefix, sort: '-population' }, // Sort by population for relevance
            }),
            transformResponse: (response: GeoDbApiResponse) => response.data,
        }),
        // Potentially add a reverse geocode endpoint here if needed later
        // getCityByLocation: builder.query<GeoDbCity, { lat: number; lon: number }>({
        // query: ({ lat, lon }) => ({
        // url: `cities`, // This is a guess, API might have a different path for reverse lookup
        // params: { location: `${lat}${lon > 0 ? '+' : ''}${lon}`, limit: 1, radius: 100 },
        // }),
        // transformResponse: (response: GeoDbApiResponse) => response.data[0],
        // }),
    }),
});

export const { useLazyGetCitiesQuery /*, useLazyGetCityByLocationQuery */ } = geoDbApi;