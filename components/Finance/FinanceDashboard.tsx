// src/components/Finance/FinanceDashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion'; // For animations
import { useDebounce } from 'use-debounce'; // For debouncing search input

import { RootState, AppDispatch } from '@/store/store';
import {
    useLazySearchSymbolQuery,
    useLazyGetGlobalQuoteQuery,
    useLazyGetTimeSeriesQuery,
    AlphaVantageSymbolMatch,
    GlobalQuoteData,
    ChartDataPoint,
    TimeSeriesFunction,
} from '@/store/services/alphaVantageApi';
import {
    setSelectedSymbol,
    setActiveTimeSeries,
    setActiveChartType,
    setSearchQuery,
    ChartType,
} from '@/store/slices/financeSlice';

// You'll need to create these sub-components:
import StockSearch from './StockSearch'; // Handles input and displays search results
import KeyMetricsDisplay from './KeyMetricsDisplay'; // Displays current price, high/low, volume etc.
import StockChart from './StockChart'; // Wrapper for your chosen charting library
import ChartControls from './ChartControls'; // Buttons for time series and chart type

const FinanceDashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        selectedSymbolInfo,
        activeTimeSeries,
        activeChartType,
        searchQuery: currentSearchQuery,
    } = useSelector((state: RootState) => state.finance);

    // RTK Query Hooks
    const [triggerSearch, { data: searchResults, isLoading: isSearching, isFetching: isFetchingSearch }] = useLazySearchSymbolQuery();
    const [triggerGlobalQuote, { data: globalQuote, isLoading: isLoadingQuote, error: quoteError }] = useLazyGetGlobalQuoteQuery();
    const [triggerTimeSeries, { data: timeSeriesData, isLoading: isLoadingTimeSeries, error: timeSeriesError }] = useLazyGetTimeSeriesQuery();

    const [debouncedSearchQuery] = useDebounce(currentSearchQuery, 500);

    useEffect(() => {
        if (debouncedSearchQuery && debouncedSearchQuery.length > 1) {
            triggerSearch(debouncedSearchQuery);
        }
    }, [debouncedSearchQuery, triggerSearch]);

    useEffect(() => {
        if (selectedSymbolInfo) {
            triggerGlobalQuote(selectedSymbolInfo['1. symbol']);
            triggerTimeSeries({
                symbol: selectedSymbolInfo['1. symbol'],
                timeSeriesFunction: activeTimeSeries,
            });
        }
    }, [selectedSymbolInfo, activeTimeSeries, triggerGlobalQuote, triggerTimeSeries]);

    const handleSymbolSelect = (symbol: AlphaVantageSymbolMatch) => {
        dispatch(setSelectedSymbol(symbol));
        dispatch(setSearchQuery('')); // Clear search input after selection
    };

    const handleTimeRangeChange = (timeRange: TimeSeriesFunction) => {
        dispatch(setActiveTimeSeries(timeRange));
    };

    const handleChartTypeChange = (type: ChartType) => {
        dispatch(setActiveChartType(type));
    };
    
    const handleSearchInputChange = (query: string) => {
        dispatch(setSearchQuery(query));
    };

    // Memoize chart data to prevent unnecessary re-renders of the chart
    const chartDataForDisplay = useMemo(() => timeSeriesData || [], [timeSeriesData]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 md:p-6 space-y-6 bg-base-200 rounded-lg shadow-xl" // Using DaisyUI/Tailwind
        >
            <h2 className="text-3xl font-bold text-primary mb-6">Finance Dashboard</h2>

            <StockSearch
                searchQuery={currentSearchQuery}
                onSearchChange={handleSearchInputChange}
                suggestions={searchResults || []}
                onSymbolSelect={handleSymbolSelect}
                isLoading={isSearching || isFetchingSearch}
            />

            {selectedSymbolInfo && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mt-6 space-y-6"
                >
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-semibold text-accent">
                            {selectedSymbolInfo['2. name']} ({selectedSymbolInfo['1. symbol']})
                        </h3>
                         {/* Potentially add company logo here if you integrate another API for that */}
                    </div>

                    <KeyMetricsDisplay quote={globalQuote} isLoading={isLoadingQuote} error={quoteError} />

                    <ChartControls
                        activeTimeSeries={activeTimeSeries}
                        activeChartType={activeChartType}
                        onTimeRangeChange={handleTimeRangeChange}
                        onChartTypeChange={handleChartTypeChange}
                    />
                    {/* Conditional rendering for loading/error state of chart */}
                    {isLoadingTimeSeries && <div className="flex justify-center items-center h-64"><span className="loading loading-lg loading-spinner text-primary"></span></div>}
                    {timeSeriesError && <div className="text-center text-error p-4">Error loading chart data.</div>}
                    {!isLoadingTimeSeries && !timeSeriesError && chartDataForDisplay.length > 0 && (
                        <StockChart
                            data={chartDataForDisplay}
                            chartType={activeChartType}
                            symbol={selectedSymbolInfo['1. symbol']}
                        />
                    )}
                    {!isLoadingTimeSeries && !timeSeriesError && chartDataForDisplay.length === 0 && selectedSymbolInfo && (
                         <div className="text-center text-info p-4">No chart data available for {selectedSymbolInfo['1. symbol']}.</div>
                    )}
                </motion.div>
            )}
             {!selectedSymbolInfo && !currentSearchQuery && (
                <div className="text-center py-10 text-neutral-content">
                    <p className="text-xl">Search for a stock symbol to get started.</p>
                </div>
            )}
        </motion.div>
    );
};

export default FinanceDashboard;