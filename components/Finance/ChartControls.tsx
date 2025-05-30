// src/components/Finance/ChartControls.tsx
import React from 'react';
import { TimeSeriesFunction } from '@/store/services/alphaVantageApi';
import { ChartType } from '@/store/slices/financeSlice';
import { ChartBarIcon, ChartPieIcon } from '@heroicons/react/24/outline'; 

interface ChartControlsProps {
    activeTimeSeries: TimeSeriesFunction;
    activeChartType: ChartType;
    onTimeRangeChange: (timeRange: TimeSeriesFunction) => void;
    onChartTypeChange: (type: ChartType) => void;
}

const timeSeriesOptions: { label: string; value: TimeSeriesFunction }[] = [
    { label: 'Daily', value: 'TIME_SERIES_DAILY' },
    { label: 'Weekly', value: 'TIME_SERIES_WEEKLY' },
    { label: 'Monthly', value: 'TIME_SERIES_MONTHLY' },
];

const chartTypeOptions: { label: string; value: ChartType; icon: React.ElementType }[] = [
    { label: 'Line', value: 'line', icon: ChartPieIcon }, // Example icon
    { label: 'Candlestick', value: 'candlestick', icon: ChartBarIcon },
];

const ChartControls: React.FC<ChartControlsProps> = ({
    activeTimeSeries,
    activeChartType,
    onTimeRangeChange,
    onChartTypeChange,
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-base-100 rounded-lg shadow">
            {/* Time Range Controls */}
            <div className="join">
                {timeSeriesOptions.map((option) => (
                    <button
                        key={option.value}
                        className={`btn join-item ${activeTimeSeries === option.value ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => onTimeRangeChange(option.value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Chart Type Controls */}
            <div className="join">
                {chartTypeOptions.map((option) => (
                    <button
                        key={option.value}
                        className={`btn join-item ${activeChartType === option.value ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => onChartTypeChange(option.value)}
                        aria-label={`Switch to ${option.label} chart`}
                    >
                        <option.icon className="h-5 w-5 mr-2" />
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChartControls;