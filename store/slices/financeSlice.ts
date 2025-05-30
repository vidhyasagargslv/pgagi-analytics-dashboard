// src/store/slices/financeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlphaVantageSymbolMatch, TimeSeriesFunction } from '../services/alphaVantageApi';

export type ChartType = 'line' | 'candlestick';

interface FinanceState {
    selectedSymbolInfo: AlphaVantageSymbolMatch | null;
    activeTimeSeries: TimeSeriesFunction;
    activeChartType: ChartType;
    searchQuery: string;
}

const initialState: FinanceState = {
    selectedSymbolInfo: null,
    activeTimeSeries: 'TIME_SERIES_DAILY',
    activeChartType: 'line',
    searchQuery: '',
};

const financeSlice = createSlice({
    name: 'finance',
    initialState,
    reducers: {
        setSelectedSymbol: (state, action: PayloadAction<AlphaVantageSymbolMatch | null>) => {
            state.selectedSymbolInfo = action.payload;
        },
        setActiveTimeSeries: (state, action: PayloadAction<TimeSeriesFunction>) => {
            state.activeTimeSeries = action.payload;
        },
        setActiveChartType: (state, action: PayloadAction<ChartType>) => {
            state.activeChartType = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        }
    },
});

export const {
    setSelectedSymbol,
    setActiveTimeSeries,
    setActiveChartType,
    setSearchQuery
} = financeSlice.actions;

export default financeSlice.reducer;