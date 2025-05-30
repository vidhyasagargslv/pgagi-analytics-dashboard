// src/components/Weather/ForecastChart.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ProcessedDailyForecast } from './types'; // Adjust path if types.ts is elsewhere

interface ForecastChartProps {
  data: ProcessedDailyForecast[];
}

const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <p className="text-center text-gray-500">No forecast data available for chart.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-base-200 p-4 rounded-lg shadow-lg border border-base-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <motion.h3 
        className="text-xl font-semibold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        5-Day Temperature Trend (°C)
      </motion.h3>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5, right: 30, left: 0, bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="maxTempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff7300" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="minTempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#387908" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#387908" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis 
              dataKey="dayName" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              label={{ value: '°C', angle: -90, position: 'insideLeft', offset:10, fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [`${value}°C`, name === 'maxTemp' ? 'Max Temp' : 'Min Temp']}
              labelFormatter={(label: string) => `Date: ${data.find(d => d.dayName === label)?.date}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="maxTemp" 
              name="Max Temp" 
              stroke="#ff7300" 
              strokeWidth={3}
              dot={{ fill: '#ff7300', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8, stroke: '#ff7300', strokeWidth: 2, fill: '#fff' }} 
              animationBegin={0}
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey="minTemp" 
              name="Min Temp" 
              stroke="#387908" 
              strokeWidth={3}
              dot={{ fill: '#387908', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8, stroke: '#387908', strokeWidth: 2, fill: '#fff' }}
              animationBegin={300}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default ForecastChart;