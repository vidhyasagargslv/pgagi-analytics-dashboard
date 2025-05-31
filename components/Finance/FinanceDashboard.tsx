
import React, {useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';

import { RootState, AppDispatch } from '@/store/store';
import {
    useLazySearchSymbolQuery,
    useLazyGetGlobalQuoteQuery,
    useLazyGetTimeSeriesQuery,
    AlphaVantageSymbolMatch,
    TimeSeriesFunction,
} from '@/store/services/alphaVantageApi';
import {
    setSelectedSymbol,
    setActiveTimeSeries,
    setActiveChartType,
    setSearchQuery,
    ChartType,
} from '@/store/slices/financeSlice';
import StockSearch from './StockSearch'; 
import KeyMetricsDisplay from './KeyMetricsDisplay';
import StockChart from './StockChart'; 
import ChartControls from './ChartControls';

const FinanceDashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        selectedSymbolInfo,
        activeTimeSeries,
        activeChartType,
        searchQuery: currentSearchQuery,
    } = useSelector((state: RootState) => state.finance);

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

    return (        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 md:p-6 space-y-6 bg-base-200 rounded-lg shadow-xl"
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
            >
                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Finance Dashboard
                </h2>
                <p className="text-gray-600 text-lg">Real-time stock data and market insights</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <StockSearch
                    searchQuery={currentSearchQuery}
                    onSearchChange={handleSearchInputChange}
                    suggestions={searchResults || []}
                    onSymbolSelect={handleSymbolSelect}
                    isLoading={isSearching || isFetchingSearch}
                />
            </motion.div>

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
            )}             {!selectedSymbolInfo && !currentSearchQuery && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    {/* Hero Section */}
                    <div className="text-center py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 rounded-2xl border border-blue-200">
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 2, -2, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-6xl mb-4"
                        >
                            📈
                        </motion.div>
                        <motion.h3 
                            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Welcome to Your Trading Hub
                        </motion.h3>
                        <motion.p 
                            className="text-xl text-gray-600 mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Search for any stock symbol to get started with real-time data and analytics
                        </motion.p>
                        <motion.div
                            className="flex justify-center space-x-4 text-sm text-gray-500"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <span>📊 Real-time quotes</span>
                            <span>📈 Interactive charts</span>
                            <span>💰 Market analysis</span>
                        </motion.div>
                    </div>

                    {/* Popular Stocks Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <motion.h4 
                            className="col-span-full text-2xl font-semibold text-center mb-4 text-info"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Popular Stocks to Explore
                        </motion.h4>
                        
                        {[
                            { symbol: "AAPL", name: "Apple Inc.", price: "$173.50", change: "+2.45%", positive: true, icon: "🍎" },
                            { symbol: "MSFT", name: "Microsoft Corp.", price: "$378.85", change: "+1.32%", positive: true, icon: "💻" },
                            { symbol: "GOOGL", name: "Alphabet Inc.", price: "$139.69", change: "-0.85%", positive: false, icon: "🔍" },
                            { symbol: "TSLA", name: "Tesla Inc.", price: "$248.50", change: "+3.22%", positive: true, icon: "🚗" },
                            { symbol: "AMZN", name: "Amazon.com Inc.", price: "$127.74", change: "+0.95%", positive: true, icon: "📦" },
                            { symbol: "NVDA", name: "NVIDIA Corp.", price: "$722.48", change: "+4.15%", positive: true, icon: "🎮" }
                        ].map((stock, index) => (
                            <motion.div
                                key={stock.symbol}
                                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-base-300 group"
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ 
                                    duration: 0.5, 
                                    delay: 0.5 + index * 0.1,
                                    type: "spring",
                                    bounce: 0.3
                                }}
                                whileHover={{ 
                                    scale: 1.03, 
                                    y: -5,
                                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSearchInputChange(stock.symbol)}
                            >
                                <div className="card-body p-4 relative overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        initial={false}
                                    />
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-2xl">{stock.icon}</span>
                                            <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                                                stock.positive 
                                                    ? 'text-green-700 bg-green-100' 
                                                    : 'text-red-700 bg-red-100'
                                            }`}>
                                                {stock.change}
                                            </span>
                                        </div>
                                        <h5 className="font-bold text-lg">{stock.symbol}</h5>
                                        <p className="text-sm  mb-2">{stock.name}</p>
                                        <p className="text-xl font-bold text-primary">{stock.price}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Market Insights Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        {/* Trading Tips Card */}
                        <motion.div 
                            className="card bg-gradient-to-br from-green-50 to-blue-50 shadow-lg border border-green-200"
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                        >
                            <div className="card-body">
                                <div className="flex items-center mb-4">
                                    <span className="text-3xl mr-3">💡</span>
                                    <h5 className="text-xl font-bold text-green-700">Trading Tips</h5>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        "Diversify your portfolio across different sectors",
                                        "Always set stop-loss orders to manage risk",
                                        "Research company fundamentals before investing",
                                        "Keep emotions in check during market volatility"
                                    ].map((tip, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-start space-x-2 p-2 bg-white/50 rounded-lg"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                                        >
                                            <span className="text-green-500 font-bold">•</span>
                                            <span className="text-sm text-gray-700">{tip}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Market Stats Card */}
                        <motion.div 
                            className="card bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg border border-purple-200"
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                        >
                            <div className="card-body">
                                <div className="flex items-center mb-4">
                                    <span className="text-3xl mr-3">📊</span>
                                    <h5 className="text-xl font-bold text-purple-700">Market Overview</h5>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: "S&P 500", value: "4,567.23", change: "+0.85%", positive: true },
                                        { label: "NASDAQ", value: "14,239.88", change: "+1.12%", positive: true },
                                        { label: "DOW", value: "34,678.90", change: "-0.25%", positive: false },
                                        { label: "VIX", value: "18.42", change: "-2.15%", positive: false }
                                    ].map((stat, index) => (
                                        <motion.div
                                            key={stat.label}
                                            className="text-center p-3 bg-white/50 rounded-lg"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                                        >
                                            <p className="text-xs text-gray-600 uppercase tracking-wide">{stat.label}</p>
                                            <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                                            <p className={`text-xs font-semibold ${
                                                stat.positive ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {stat.change}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Call to Action */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="text-center py-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white"
                    >
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-4xl mb-4"
                        >
                            🚀
                        </motion.div>
                        <h4 className="text-2xl font-bold mb-2">Ready to Start Trading?</h4>
                        <p className="text-lg opacity-90 mb-4">
                            Use the search bar above to find your favorite stocks and start analyzing!
                        </p>
                        <motion.button
                            className="btn btn-lg bg-white text-blue-600 hover:bg-gray-100 border-none"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => document.querySelector('input')?.focus()}
                        >
                            Start Searching 🔍
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default FinanceDashboard;