import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import { syncWithSessionStorage } from './slice/cart.slice';

const store = configureStore({
    reducer: rootReducer, // Directly use rootReducer without persisting
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(syncWithSessionStorage),
});

export default store;