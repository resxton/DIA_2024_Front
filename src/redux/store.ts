// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './filterSlice'; // Импортируем редюсер фильтров
import authReducer from './authSlice'; // Импортируем редюсер авторизации

export const store = configureStore({
  reducer: {
    filter: filterReducer, 
    auth: authReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
