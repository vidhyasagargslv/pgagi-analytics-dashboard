import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AlphaVantageSymbolMatch } from '@/store/services/alphaVantageApi';

interface StockSearchProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    suggestions: AlphaVantageSymbolMatch[];
    onSymbolSelect: (symbol: AlphaVantageSymbolMatch) => void;
    isLoading: boolean;
}

const StockSearch: React.FC<StockSearchProps> = ({
    searchQuery,
    onSearchChange,
    suggestions,
    onSymbolSelect,
    isLoading,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside to close suggestions
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchContainerRef]);    const handleSelect = (symbol: AlphaVantageSymbolMatch) => {
        onSymbolSelect(symbol);
        setIsFocused(false); // Close suggestions on select
    };

    return (
        <motion.div 
            ref={searchContainerRef} 
            className="relative w-full md:max-w-xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="form-control ">
                <motion.div 
                    className={`flex flex-row items-center transition-all border duration-300 rounded-lg opacity-25 overflow-hidden ${
                        isFocused ? 'shadow-lg shadow-slate-400' : 'shadow-md'
                    }`}
                    whileFocus={{ scale: 1.02 }}
                >
                    <span className="input-group-text px-2 border-0 flex items-center">
                        <motion.div
                            animate={isLoading ? { rotate: 360 } : {}}
                            transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                        >
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </motion.div>
                    </span>
                    <motion.input
                        type="text"
                        placeholder="Search for a stock symbol (e.g., AAPL, MSFT, GOOGL)"
                        className="input w-full outline focus:outline-none border transition-all duration-300 text-lg"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        whileFocus={{ scale: 1.02 }}
                    />
                    <AnimatePresence initial={false}>
                        {searchQuery && (
                            <motion.button
                                className="btn btn-ghost btn-square hover:bg-red-100 hover:text-red-600 transition-colors duration-200 flex items-center"
                                onClick={() => onSearchChange('')}
                                aria-label="Clear search"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <AnimatePresence>
                {isFocused && searchQuery.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-10 w-full mt-2 bg-base-100 shadow-2xl rounded-lg max-h-72 overflow-y-auto border border-blue-200 backdrop-blur-sm"
                    >
                        {isLoading && (
                            <motion.li 
                                className="p-6 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="loading loading-dots loading-md text-blue-500"></span>
                                    <span className="text-gray-600">Searching stocks...</span>
                                </div>
                            </motion.li>
                        )}
                        {!isLoading && suggestions.length === 0 && searchQuery.length > 1 && (
                            <motion.li 
                                className="p-6 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="text-gray-500">
                                    <span className="text-2xl mb-2 block">🔍</span>
                                    <p>No results found for "{searchQuery}"</p>
                                    <p className="text-sm mt-1">Try searching for a different symbol</p>
                                </div>
                            </motion.li>
                        )}
                        {!isLoading &&
                            suggestions.map((symbol, index) => (
                                <motion.li
                                    key={symbol['1. symbol']}
                                    className="px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 ease-in-out border-b border-gray-100 last:border-b-0 group"
                                    onClick={() => handleSelect(symbol)}
                                    role="option"
                                    aria-selected="false"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    whileHover={{ 
                                        x: 5,
                                        backgroundColor: "rgba(59, 130, 246, 0.05)"
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                                                {symbol['2. name']} 
                                                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                                    {symbol['1. symbol']}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                <span className="inline-flex items-center space-x-2">
                                                    <span>📈 {symbol['3. type']}</span>
                                                    <span>•</span>
                                                    <span>🌍 {symbol['4. region']}</span>
                                                    <span>•</span>
                                                    <span>💰 {symbol['8. currency']}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <motion.div
                                            className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            →
                                        </motion.div>
                                    </div>
                                </motion.li>
                            ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StockSearch;