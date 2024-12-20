// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './filterSlice'; // Импортируем редюсер фильтров
import authReducer from './authSlice'; // Импортируем редюсер авторизации
import configurationElementsReducer from './configurationElementsSlice';
import loggerMiddleware from './loggerMiddleware';

export const store = configureStore({
  reducer: {
    filter: filterReducer, 
    auth: authReducer, 
    configurationElements: configurationElementsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware), // Добавление loggerMiddleware
});

// Типизация dispatch
export type AppDispatch = typeof store.dispatch;

// Типизация состояния
export type RootState = ReturnType<typeof store.getState>;

export default store;