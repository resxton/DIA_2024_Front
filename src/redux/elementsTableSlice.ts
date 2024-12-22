import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { ConfigurationElement } from '../api/Api';

// Типы для начального состояния
interface ElementsTableState {
  elements: ConfigurationElement[];
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: ElementsTableState = {
  elements: [],
  loading: false,
  error: null,
};

// Создание асинхронных операций с помощью createAsyncThunk
export const fetchElements = createAsyncThunk('elementsTable/fetchElements', async () => {
  const response = await api.planeConfigurationElements.planeConfigurationElementsList();
  return response.data.configuration_elements || [];
});

export const deleteElement = createAsyncThunk(
  'elementsTable/deleteElement',
  async (id: string) => {
    await api.planeConfigurationElement.planeConfigurationElementDelete(id);
    return id; // Возвращаем ID удаленного элемента
  }
);

export const elementsTableSlice = createSlice({
  name: 'elementsTable',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Загрузка элементов
      .addCase(fetchElements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchElements.fulfilled, (state, action) => {
        state.loading = false;
        state.elements = action.payload;
      })
      .addCase(fetchElements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки элементов';
      })
      
      // Удаление элемента
      .addCase(deleteElement.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteElement.fulfilled, (state, action) => {
		state.loading = false;
		// Используйте явное приведение типов для сравнения
		state.elements = state.elements.filter(element => String(element.pk) !== String(action.payload));
	  })	  
      .addCase(deleteElement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при удалении элемента';
      });
  },
});

export default elementsTableSlice.reducer;
