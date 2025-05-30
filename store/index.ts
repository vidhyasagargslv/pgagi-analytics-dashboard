import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { geoDbApi } from './services/geoDbApi';
import { weatherApi } from './services/weatherApi';
import { newsApi } from './services/newsApi';

export const store = configureStore({
reducer: {
        
        [geoDbApi.reducerPath]: geoDbApi.reducer,
        [weatherApi.reducerPath]: weatherApi.reducer,
        [newsApi.reducerPath]: newsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(geoDbApi.middleware)
            .concat(weatherApi.middleware)
            .concat(newsApi.middleware),
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;