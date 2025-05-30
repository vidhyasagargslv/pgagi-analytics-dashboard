// src/components/Weather/ForecastChart.tsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ProcessedDailyForecast } from './types'; // Adjust path if types.ts is elsewhere

interface ForecastChartProps {
  data: ProcessedDailyForecast[];
}

const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No forecast data available for chart.</p>;
  }

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-center">5-Day Temperature Trend (°F)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5, right: 30, left: 0, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          <XAxis dataKey="dayName" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} label={{ value: '°F', angle: -90, position: 'insideLeft', offset:10, fontSize: 12 }}/>
          <Tooltip
            formatter={(value: number, name: string) => [`${value}°F`, name === 'maxTemp' ? 'Max Temp' : 'Min Temp']}
            labelFormatter={(label: string) => `Date: ${data.find(d => d.dayName === label)?.date}`}
          />
          <Legend />
          <Line type="monotone" dataKey="maxTemp" name="Max Temp" stroke="#ff7300" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="minTemp" name="Min Temp" stroke="#387908" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;