// src/store/store.ts
// ... other imports
import { configureStore } from '@reduxjs/toolkit';
import { alphaVantageApi } from './services/alphaVantageApi';
import { geoDbApi } from './services/geoDbApi';
import { newsApi } from './services/newsApi';
import { weatherApi } from './services/weatherApi';
import financeReducer from './slices/financeSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
    reducer: {
         finance: financeReducer,
        [geoDbApi.reducerPath]: geoDbApi.reducer,
        [weatherApi.reducerPath]: weatherApi.reducer,
        [newsApi.reducerPath]: newsApi.reducer,
        [alphaVantageApi.reducerPath]: alphaVantageApi.reducer, // Add this
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(geoDbApi.middleware)
            .concat(weatherApi.middleware)
            .concat(newsApi.middleware)
            .concat(alphaVantageApi.middleware), // Add this
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
