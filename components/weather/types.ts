
export interface ProcessedDailyForecast {
  date: string;
  dayName: string;
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}