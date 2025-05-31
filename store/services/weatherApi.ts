import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// --- Interfaces for Current Weather ---
interface WeatherCondition {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface MainWeatherData {
    temp: number;  // Current temperature but values are not accurate
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
}

interface WindData {
    speed: number;
    deg: number;
    gust?: number;
}

interface CloudsData {
    all: number;
}

interface SysData {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
}

export interface CurrentWeatherResponse {
    coord: {
        lon: number;
        lat: number;
    };
    weather: WeatherCondition[];
    base: string;
    main: MainWeatherData;
    visibility: number;
    wind: WindData;
    clouds: CloudsData;
    dt: number;
    sys: SysData;
    timezone: number;
    id: number;
    name: string; // City name
    cod: number;
}

// --- Interfaces for 5-Day Forecast ---
// Note: The 5-day forecast API returns data in 3-hour intervals
interface ForecastListItemMain {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
}

export interface ForecastListItem {
    dt: number; // Timestamp
    main: ForecastListItemMain;
    weather: WeatherCondition[];
    clouds: CloudsData;
    wind: WindData;
    visibility: number;
    pop: number; // Probability of precipitation
    sys: { pod: string };
    dt_txt: string; 
}

interface CityData {
    id: number;
    name: string;
    coord: {
        lat: number;
        lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
}

export interface FiveDayForecastResponse {
    cod: string;
    message: number;
    cnt: number; // Number of 3-hour forecast periods
    list: ForecastListItem[];
    city: CityData;
}


export const weatherApi = createApi({
    reducerPath: 'weatherApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://open-weather13.p.rapidapi.com/',
        prepareHeaders: (headers) => {
            const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
            if (apiKey) {
                headers.set('x-rapidapi-key', apiKey);
                // headers.set('x-rapidapi-host', 'open-weather13.p.rapidapi.com');
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getCurrentWeatherByCity: builder.query<CurrentWeatherResponse, string>({
            query: (cityName) => ({
                url: 'city',
                params: { city: cityName, lang: 'EN', units: 'metric' }, // units: metric for Celsius
            }),
        }),
        getCurrentWeatherByCoords: builder.query<CurrentWeatherResponse, { lat: number; lon: number }>({
            query: ({ lat, lon }) => ({

                url: 'city', // Placeholder, will need city name
                params: { city: 'London', lang: 'EN', units: 'metric' }, // This will be dynamically set by the user
            }),
        }),
        getFiveDayForecast: builder.query<FiveDayForecastResponse, { lat: number; lon: number }>({
            query: ({ lat, lon }) => ({
                url: 'fivedaysforcast',
                params: { latitude: lat, longitude: lon, lang: 'EN', units: 'metric' },
            }),
        }),
    }),
});

export const {
    useLazyGetCurrentWeatherByCityQuery,
    useLazyGetFiveDayForecastQuery,
    
} = weatherApi;