// src/store/services/weatherApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// --- Interfaces for Current Weather ---
interface WeatherCondition {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface MainWeatherData {
    temp: number;
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
// Assuming a structure similar to OpenWeatherMap's 5-day/3-hour forecast
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
    sys: { pod: string }; // Part of the day (d or n)
    dt_txt: string; // Date time string e.g., "2024-05-25 12:00:00"
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
                // This endpoint might not exist directly on open-weather13 for current weather by coords
                // It expects a city. We might need to reverse geocode first, or use the 5-day forecast city name.
                // For now, let's assume we get city name first then call getCurrentWeatherByCity
                // Or, if the API *does* support lat/lon for current weather, the path/params would change.
                // The provided example `open-weather13.p.rapidapi.com/city?city=new%20york` implies it only takes city.
                // We will try to get city name from geolocation -> 5day forecast -> then current weather.
                // This specific endpoint might not be directly used if the above strategy is employed.
                // If direct by-coord is needed, the API spec for open-weather13 for it would be required.
                // As a fallback, we could use the standard OpenWeatherMap API directly if allowed:
                // `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=YOUR_OWM_KEY`
                // But sticking to provided APIs:
                // We will use city name from 5-day forecast for the initial geolocation weather.
                url: 'city', // Placeholder, will need city name
                params: { city: 'London', lang: 'EN', units: 'metric' }, // This will be dynamically set
                // This endpoint is tricky given the API structure.
                // Let's plan to fetch 5-day forecast by coords, get city name from its response,
                // then call getCurrentWeatherByCity with that name.
            }),
        }),
        getFiveDayForecast: builder.query<FiveDayForecastResponse, { lat: number; lon: number }>({
            query: ({ lat, lon }) => ({
                url: 'fivedaysforcast', // Note: 'fivedaysforcast' in user's example (typo in API path?)
                params: { latitude: lat, longitude: lon, lang: 'EN', units: 'metric' },
            }),
        }),
    }),
});

export const {
    useLazyGetCurrentWeatherByCityQuery,
    useLazyGetFiveDayForecastQuery,
    // useLazyGetCurrentWeatherByCoordsQuery // Might not be directly used this way
} = weatherApi;