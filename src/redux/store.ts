// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './filterSlice'; // Импортируем редюсер фильтров
import authReducer from './authSlice'; // Импортируем редюсер авторизации
import configurationElementsReducer from './configurationElementsSlice';
import configurationReducer from './configurationSlice'
import loggerMiddleware from './loggerMiddleware';
import elementsTableReducer from './elementsTableSlice'
import createElementReducer from './createElementSlice'

export const store = configureStore({
  reducer: {
    filter: filterReducer, 
    auth: authReducer, 
    configurationElements: configurationElementsReducer,
    configuration: configurationReducer,
    elementsTable: elementsTableReducer,
    createElement: createElementReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware), // Добавление loggerMiddleware
});

// Типизация dispatch
export type AppDispatch = typeof store.dispatch;

// Типизация состояния
export type RootState = ReturnType<typeof store.getState>;

export default store;