// src/components/Finance/KeyMetricsDisplay.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CurrencyDollarIcon,
    BuildingStorefrontIcon,
    ScaleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { GlobalQuoteData } from '@/store/services/alphaVantageApi';

interface KeyMetricsDisplayProps {
    quote: GlobalQuoteData | undefined;
    isLoading: boolean;
    error: any; // Consider a more specific error type
}

const MetricCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; change?: number; unit?: string;isLoading?: boolean }> = ({
    title,
    value,
    icon: Icon,
    change,
    unit,
    isLoading
}) => {
    const isPositive = change !== undefined && change > 0;
    const isNegative = change !== undefined && change < 0;

    if (isLoading) {
        return (
            <div className="card bg-base-100 shadow-md p-4 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-slate-700 rounded w-1/2"></div>
            </div>
        );
    }

    return (
        <motion.div
            className="card bg-base-100 shadow-md p-4"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-neutral-content">{title}</h4>
                <Icon className="h-5 w-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-base-content">
                {value}
                {unit && <span className="text-lg ml-1">{unit}</span>}
            </p>
            {change !== undefined && (
                <div className={`flex items-center text-sm mt-1 ${isPositive ? 'text-success' : isNegative ? 'text-error' : 'text-neutral-content'}`}>
                    {isPositive && <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />}
                    {isNegative && <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
                    {change.toFixed(2)}%
                </div>
            )}
        </motion.div>
    );
};


const KeyMetricsDisplay: React.FC<KeyMetricsDisplayProps> = ({ quote, isLoading, error }) => {
    if (error) {
        return (
            <div className="alert alert-error shadow-lg">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Error fetching key metrics. Please try again.</span>
                </div>
            </div>
        );
    }

    const metrics = [
        { title: 'Current Price', value: quote ? parseFloat(quote['05. price']).toFixed(2) : '-', icon: CurrencyDollarIcon, change: quote ? parseFloat(quote['10. change percent'].replace('%','')) : undefined, unit: quote ? quote['01. symbol'].includes('.BSE') ? 'INR' : 'USD' : '' },
        { title: 'Daily High', value: quote ? parseFloat(quote['03. high']).toFixed(2) : '-', icon: ArrowTrendingUpIcon },
        { title: 'Daily Low', value: quote ? parseFloat(quote['04. low']).toFixed(2) : '-', icon: ArrowTrendingDownIcon },
        { title: 'Volume', value: quote ? parseInt(quote['06. volume']).toLocaleString() : '-', icon: ScaleIcon },
        { title: 'Previous Close', value: quote ? parseFloat(quote['08. previous close']).toFixed(2) : '-', icon: ClockIcon },
        { title: 'Open', value: quote ? parseFloat(quote['02. open']).toFixed(2) : '-', icon: BuildingStorefrontIcon },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
                <MetricCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    icon={metric.icon}
                    change={metric.change}
                    unit={metric.unit}
                    isLoading={isLoading}
                />
            ))}
        </div>
    );
};

export default KeyMetricsDisplay;