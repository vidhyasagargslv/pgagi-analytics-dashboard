// src/components/Finance/StockSearch.tsx
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
    }, [searchContainerRef]);

    const handleSelect = (symbol: AlphaVantageSymbolMatch) => {
        onSymbolSelect(symbol);
        setIsFocused(false); // Close suggestions on select
    };

    return (
        <div ref={searchContainerRef} className="relative w-full md:max-w-xl mx-auto">
            <div className="form-control">
                <div className="input-group">
                    <span className="input-group-text bg-base-300 border-r-0">
                        <MagnifyingGlassIcon className="h-5 w-5 text-neutral-content" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search for a stock symbol (e.g., AAPL, MSFT)"
                        className="input input-bordered w-full focus:outline-none focus:border-primary transition-colors"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                    />
                    {searchQuery && (
                         <button
                            className="btn btn-ghost btn-square"
                            onClick={() => onSearchChange('')}
                            aria-label="Clear search"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isFocused && searchQuery.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 w-full mt-1 bg-base-100 shadow-lg rounded-md max-h-72 overflow-y-auto border border-neutral"
                    >
                        {isLoading && (
                            <li className="p-4 text-center">
                                <span className="loading loading-dots loading-md text-primary"></span>
                            </li>
                        )}
                        {!isLoading && suggestions.length === 0 && searchQuery.length > 1 && (
                            <li className="p-4 text-center text-neutral-content">No results found.</li>
                        )}
                        {!isLoading &&
                            suggestions.map((symbol) => (
                                <li
                                    key={symbol['1. symbol']}
                                    className="px-4 py-3 hover:bg-primary hover:text-primary-content cursor-pointer transition-colors duration-150 ease-in-out"
                                    onClick={() => handleSelect(symbol)}
                                    role="option"
                                    aria-selected="false" // Can be enhanced for keyboard navigation
                                >
                                    <div className="font-semibold">{symbol['2. name']} ({symbol['1. symbol']})</div>
                                    <div className="text-sm text-neutral-content/70">
                                        {symbol['3. type']} - {symbol['4. region']} - {symbol['8. currency']}
                                    </div>
                                </li>
                            ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StockSearch;