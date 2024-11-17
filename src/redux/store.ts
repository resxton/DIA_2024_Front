// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './filterSlice'; // Импортируем редюсер фильтров

export const store = configureStore({
  reducer: {
    filter: filterReducer, // Добавляем редюсер фильтров
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
