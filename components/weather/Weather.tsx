"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    return (
      <motion.img 
        src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`} 
        alt="weather icon" 
        className="w-16 h-16 mx-auto" 
        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        whileHover={{ 
          scale: 1.1, 
          rotate: [0, -10, 10, 0],
          transition: { duration: 0.4 }
        }}
      />
    );
  }
  return (
    <motion.div 
      className="p-4 md:p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Weather Forecast
        </h2>
      </motion.div>      {/* Search Bar */}
      <motion.div 
        className="relative max-w-lg mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.input
          type="text"
          placeholder="Search for a city..."
          value={citySearchInput}
          onChange={(e) => setCitySearchInput(e.target.value)}
          onFocus={() => citySearchInput.trim().length > 2 && citySuggestions && citySuggestions.length > 0 && setShowSuggestions(true)}
          className="input input-bordered w-full pr-10 transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          whileFocus={{ scale: 1.02 }}
        />
         <motion.button
            onClick={() => {setCitySearchInput(''); setShowSuggestions(false);}}
            className="absolute top-0 right-0 h-full px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Clear search or close suggestions"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ✕
          </motion.button>
        <AnimatePresence>
          {showSuggestions && citySuggestions && citySuggestions.length > 0 && (
            <motion.ul
              className="absolute z-10 w-full bg-base-100 border border-base-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto backdrop-blur-sm"
              onMouseLeave={() => setTimeout(() => setShowSuggestions(false), 300)}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {isLoadingCities && <li className="p-2 text-center"><LoadingSpinner size="sm" /></li>}
              {isErrorCities && <li className="p-2 text-error">Error fetching cities.</li>}
              {!isLoadingCities && citySuggestions.map((city, index) => (
                <motion.li
                  key={city.id}
                  className="p-3 hover:bg-base-200 cursor-pointer transition-colors duration-200"
                  onClick={() => handleCitySelect(city as GeoDbCitySuggestion)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', x: 5 }}
                >
                  {city.name}, {city.country}
                </motion.li>
              ))}
               {!isLoadingCities && citySuggestions.length === 0 && debouncedCitySearchTerm.length > 2 && (
                <motion.li 
                  className="p-3 text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No cities found.
                </motion.li>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>      {/* ... rest of the Weather component (Current Weather, Forecast Display) remains the same */}
      <AnimatePresence>
        {isLoadingCurrent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {errorCurrent && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
          >
            <ErrorMessage message={(errorCurrent as any)?.data?.message || 'Failed to load current weather.'} />
          </motion.div>
        )}
      </AnimatePresence>{/* Current Weather Display */}
      <AnimatePresence mode="wait">
        {currentWeather && !isLoadingCurrent && (
          <motion.div 
            className="card lg:card-side bg-base-100 shadow-xl max-w-2xl mx-auto overflow-hidden border border-base-300"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.3 }
            }}
          >
            <motion.figure 
              className="p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 text-white flex flex-col items-center justify-center lg:w-1/3 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                    "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                    "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 100%)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.4 }}
              >
                {renderWeatherIcon(currentWeather.weather[0].icon)}
              </motion.div>
              <motion.figcaption 
                className="text-center z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.p 
                  className="text-4xl font-bold"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
                >
                  {Math.round(currentWeather.main.temp)}°C
                </motion.p>
                <motion.p 
                  className="capitalize text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  {currentWeather.weather[0].description}
                </motion.p>
              </motion.figcaption>
            </motion.figure>
            <motion.div 
              className="card-body lg:w-2/3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.h2 
                className="card-title text-2xl text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {currentWeather.name}, {currentWeather.sys.country}
              </motion.h2>
              <motion.div 
                className="grid grid-cols-2 gap-2 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {[
                  { label: "Feels like", value: `${Math.round(currentWeather.main.feels_like)}°C` },
                  { label: "Humidity", value: `${currentWeather.main.humidity}%` },
                  { label: "Wind", value: `${Math.round(currentWeather.wind.speed * 3.6)} km/h` },
                  { label: "Pressure", value: `${currentWeather.main.pressure} hPa` },
                  { label: "Visibility", value: `${currentWeather.visibility / 1000} km` },
                  { label: "Sunrise", value: new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString() },
                  { label: "Sunset", value: new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString() }
                ].map((item, index) => (
                  <motion.p 
                    key={item.label}
                    className="p-2 bg-base-200/50 rounded-md backdrop-blur-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                  >
                    <strong>{item.label}:</strong> {item.value}
                  </motion.p>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>      <AnimatePresence>
        {isLoadingForecast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {errorForecast && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
          >
            <ErrorMessage message={(errorForecast as any)?.data?.message || 'Failed to load 5-day forecast.'} />
          </motion.div>
        )}
      </AnimatePresence>{/* 5-Day Forecast Display */}
      <AnimatePresence mode="wait">
        {processedForecast.length > 0 && !isLoadingForecast && (
          <motion.div 
            className="space-y-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ForecastChart data={processedForecast} />
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {processedForecast.map((day, index) => (
                <motion.div 
                  key={day.date} 
                  className="card bg-base-100 shadow-md text-center p-4 border border-base-200 hover:border-blue-300 transition-all duration-300 relative overflow-hidden group"
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.5 + index * 0.1,
                    type: "spring",
                    bounce: 0.3
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  <div className="relative z-10">
                    <motion.h4 
                      className="font-semibold text-lg text-info mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    >
                      {day.dayName}
                    </motion.h4>
                    <motion.p 
                      className="text-xs text-gray-500 mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    >
                      {new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short'})}
                    </motion.p>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.8 + index * 0.1,
                        type: "spring",
                        bounce: 0.4
                      }}
                    >
                      {renderWeatherIcon(day.icon)}
                    </motion.div>
                    <motion.p 
                      className="text-lg font-bold"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: 0.9 + index * 0.1,
                        type: "spring"
                      }}
                    >
                      <span className="text-orange-600">{Math.round(day.maxTemp)}°</span>
                      <span className="text-gray-400 ml-1">{Math.round(day.minTemp)}°</span>
                    </motion.p>
                    <motion.p 
                      className="text-xs capitalize text-gray-600 mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                    >
                      {day.description}
                    </motion.p>
                    <motion.div
                      className="space-y-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                    >
                      <p className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-1">
                        💧 {day.humidity}%
                      </p>
                      <p className="text-xs bg-green-50 text-green-700 rounded-full px-2 py-1">
                        💨 {day.windSpeed} km/h
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>      <AnimatePresence>
        {!selectedCity && !isLoadingCurrent && !isLoadingForecast && !citySearchInput && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl mb-4"
            >
              🌤️
            </motion.div>
            <motion.p 
              className="text-gray-500 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Search for a city or allow geolocation to see the weather forecast.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Weather;