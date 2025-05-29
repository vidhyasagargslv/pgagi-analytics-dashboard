"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useLazyGetCitiesQuery } from '../../store/services/geoDbApi';
import {
  useLazyGetCurrentWeatherByCityQuery,
  useLazyGetFiveDayForecastQuery,
  CurrentWeatherResponse,
  FiveDayForecastResponse,
  ForecastListItem
} from '../../store/services/weatherApi';
import ForecastChart from './ForecastChart';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { ProcessedDailyForecast } from './types';
import useDebounce from '../../hooks/useDebounce'; 

interface GeoDbCitySuggestion {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

const Weather: React.FC = () => {
  const [citySearchInput, setCitySearchInput] = useState(''); // For the input field
  const debouncedCitySearchTerm = useDebounce(citySearchInput, 400); // Debounce the input
  const [selectedCity, setSelectedCity] = useState<{ name: string; lat: number; lon: number } | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [triggerGetCities, { data: citySuggestions, isLoading: isLoadingCities, isError: isErrorCities }] = useLazyGetCitiesQuery();
  const [triggerCurrentWeather, { data: currentWeather, isLoading: isLoadingCurrent, error: errorCurrent }] = useLazyGetCurrentWeatherByCityQuery();
  const [triggerFiveDayForecast, { data: fiveDayForecast, isLoading: isLoadingForecast, error: errorForecast }] = useLazyGetFiveDayForecastQuery();

  const handleFetchWeatherForCity = useCallback((city: { name: string; lat: number; lon: number }) => {
    setSelectedCity(city);
    triggerCurrentWeather(city.name);
    triggerFiveDayForecast({ lat: city.lat, lon: city.lon });
    setCitySearchInput(''); // Clear input after selection
    setShowSuggestions(false);
  }, [triggerCurrentWeather, triggerFiveDayForecast]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const forecastResult = await triggerFiveDayForecast({ lat: latitude, lon: longitude }).unwrap();
          if (forecastResult && forecastResult.city) {
            const geoCity = {
              name: forecastResult.city.name,
              lat: forecastResult.city.coord.lat,
              lon: forecastResult.city.coord.lon,
            };
            setSelectedCity(geoCity);
            triggerCurrentWeather(geoCity.name);
          }
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
        }
      );
    }
  }, [triggerFiveDayForecast, triggerCurrentWeather]);

  // Effect to fetch city suggestions based on debounced search term
  useEffect(() => {
    if (debouncedCitySearchTerm.trim().length > 2) {
      triggerGetCities(debouncedCitySearchTerm);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      // Optionally clear suggestions if citySuggestions is not empty and search term is too short
    }
  }, [debouncedCitySearchTerm, triggerGetCities]);


  const handleCitySelect = (city: GeoDbCitySuggestion) => {
    handleFetchWeatherForCity({ name: city.name, lat: city.latitude, lon: city.longitude });
  };

  const processForecastData = (forecastData: FiveDayForecastResponse | undefined): ProcessedDailyForecast[] => {
    // ... (same as before)
    if (!forecastData || !forecastData.list) return [];

    const dailyData: { [key: string]: { temps: number[], humidities: number[], winds: number[], weather: ForecastListItem[], icons: string[], descriptions: string[] } } = {};

    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyData[date]) {
        dailyData[date] = { temps: [], humidities: [], winds:[], weather: [], icons: [], descriptions: [] };
      }
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].humidities.push(item.main.humidity);
      dailyData[date].winds.push(item.wind.speed);
      dailyData[date].weather.push(item);
      if (item.weather[0]) {
        dailyData[date].icons.push(item.weather[0].icon);
        dailyData[date].descriptions.push(item.weather[0].description);
      }
    });

    return Object.keys(dailyData).map(date => {
      const day = dailyData[date];
      const midDayWeather = day.weather.find(w => w.dt_txt.includes("12:00:00")) || day.weather[0];
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

      return {
        date,
        dayName,
        minTemp: Math.min(...day.temps),
        maxTemp: Math.max(...day.temps),
        avgTemp: day.temps.reduce((a, b) => a + b, 0) / day.temps.length,
        description: midDayWeather.weather[0]?.description || 'N/A',
        icon: midDayWeather.weather[0]?.icon || '01d',
        humidity: Math.round(day.humidities.reduce((a,b) => a + b, 0) / day.humidities.length),
        windSpeed: Math.round(day.winds.reduce((a,b) => a + b, 0) / day.winds.length * 3.6), // m/s to km/h
      };
    }).slice(0, 5); // Ensure only 5 days
  };

  const processedForecast = processForecastData(fiveDayForecast);

  const renderWeatherIcon = (iconCode: string) => {
    return <img src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`} alt="weather icon" className="w-16 h-16 mx-auto" />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Weather Forecast</h2>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search for a city..."
          value={citySearchInput}
          onChange={(e) => setCitySearchInput(e.target.value)}
          onFocus={() => citySearchInput.trim().length > 2 && citySuggestions && citySuggestions.length > 0 && setShowSuggestions(true)}
          // onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
          className="input input-bordered w-full pr-10"
        />
         <button
            onClick={() => {setCitySearchInput(''); setShowSuggestions(false);}}
            className="absolute top-0 right-0 h-full px-3 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="Clear search or close suggestions"
          >
            ✕
          </button>
        {showSuggestions && citySuggestions && citySuggestions.length > 0 && (
          <ul
            className="absolute z-10 w-full bg-base-100 border border-base-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
            onMouseLeave={() => setTimeout(() => setShowSuggestions(false), 300)} // Hide if mouse leaves list
          >
            {isLoadingCities && <li className="p-2 text-center"><LoadingSpinner size="sm" /></li>}
            {isErrorCities && <li className="p-2 text-error">Error fetching cities.</li>}
            {!isLoadingCities && citySuggestions.map(city => (
              <li
                key={city.id}
                className="p-3 hover:bg-base-200 cursor-pointer"
                onClick={() => handleCitySelect(city as GeoDbCitySuggestion)}
              >
                {city.name}, {city.country}
              </li>
            ))}
             {!isLoadingCities && citySuggestions.length === 0 && debouncedCitySearchTerm.length > 2 && (
              <li className="p-3 text-gray-500">No cities found.</li>
            )}
          </ul>
        )}
      </div>

      {/* ... rest of the Weather component (Current Weather, Forecast Display) remains the same */}
      {isLoadingCurrent && <LoadingSpinner />}
      {errorCurrent && <ErrorMessage message={(errorCurrent as any)?.data?.message || 'Failed to load current weather.'} />}

      {/* Current Weather Display */}
      {currentWeather && !isLoadingCurrent && (
        <div className="card lg:card-side bg-base-100 shadow-xl max-w-2xl mx-auto">
          <figure className="p-4 bg-primary text-primary-content flex flex-col items-center justify-center lg:w-1/3">
            {renderWeatherIcon(currentWeather.weather[0].icon)}
            <figcaption className="text-center">
              <p className="text-4xl font-bold">{Math.round(currentWeather.main.temp)}°C</p>
              <p className="capitalize">{currentWeather.weather[0].description}</p>
            </figcaption>
          </figure>
          <div className="card-body lg:w-2/3">
            <h2 className="card-title text-2xl">{currentWeather.name}, {currentWeather.sys.country}</h2>
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <p><strong>Feels like:</strong> {Math.round(currentWeather.main.feels_like)}°C</p>
              <p><strong>Humidity:</strong> {currentWeather.main.humidity}%</p>
              <p><strong>Wind:</strong> {Math.round(currentWeather.wind.speed * 3.6)} km/h</p> {/* m/s to km/h */}
              <p><strong>Pressure:</strong> {currentWeather.main.pressure} hPa</p>
              <p><strong>Visibility:</strong> {currentWeather.visibility / 1000} km</p>
              <p><strong>Sunrise:</strong> {new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString()}</p>
              <p><strong>Sunset:</strong> {new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      )}

      {isLoadingForecast && <LoadingSpinner />}
      {errorForecast && <ErrorMessage message={(errorForecast as any)?.data?.message || 'Failed to load 5-day forecast.'} />}

      {/* 5-Day Forecast Display */}
      {processedForecast.length > 0 && !isLoadingForecast && (
        <div className="space-y-6 mt-8">
          <ForecastChart data={processedForecast} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {processedForecast.map(day => (
              <div key={day.date} className="card bg-base-100 shadow-md text-center p-4">
                <h4 className="font-semibold">{day.dayName}</h4>
                <p className="text-xs text-gray-500">{new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short'})}</p>
                {renderWeatherIcon(day.icon)}
                <p className="text-lg font-bold">{Math.round(day.maxTemp)}° <span className="text-gray-400">{Math.round(day.minTemp)}°</span></p>
                <p className="text-xs capitalize">{day.description}</p>
                <p className="text-xs mt-1">Humidity: {day.humidity}%</p>
                <p className="text-xs">Wind: {day.windSpeed} km/h</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedCity && !isLoadingCurrent && !isLoadingForecast && !citySearchInput && (
          <p className="text-center text-gray-500 mt-8">
            Search for a city or allow geolocation to see the weather forecast.
          </p>
        )}
    </div>
  );
};

export default Weather;