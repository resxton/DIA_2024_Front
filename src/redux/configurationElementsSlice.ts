import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api';
import { ConfigurationElement, ConfigurationElementsResult } from '../api/Api';

// Типы данных
interface ConfigurationElementsState {
  [x: string]: any;
  draftConfigurationId: number | null;
  draftElementsCount: number;
  elements: ConfigurationElement[];
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: ConfigurationElementsState = {
  draftConfigurationId: null,
  draftElementsCount: 0,
  elements: [],
  loading: false,
  error: null,
};

// AsyncThunk для получения данных
export const fetchConfigurationElements = createAsyncThunk(
  'configurationElements/fetch',
  async ({ category, price_min, price_max }: { category: string; price_min: number; price_max: number }) => {
    const response = await api.planeConfigurationElements.planeConfigurationElementsList({
      category,
      price_min,
      price_max,
    }, { withCredentials: true });
    return response.data as ConfigurationElementsResult;
  }
);

// AsyncThunk для добавления элемента в черновик
export const addElementToDraft = createAsyncThunk(
  'configurationElements/addToDraft',
  async (id: number, { getState }) => {
    // В этой части можно добавить логику для взаимодействия с API
    // например, для добавления элемента в черновик
    const response = await api.planeConfigurationElement.planeConfigurationElementCreate(id, {
      withCredentials: true,
    });

    const state = getState() as { configurationElements: ConfigurationElementsState };
    return { id, newDraftCount: state.configurationElements.draftElementsCount + 1 };
  }
);

// Slice для состояния
const configurationElementsSlice = createSlice({
  name: 'configurationElements',
  initialState,
  reducers: {
    clearDraft: (state) => {
      state.draftConfigurationId = null; // Обнуляем ID черновика
      state.draftElementsCount = 0;      // Обнуляем количество элементов в черновике
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigurationElements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConfigurationElements.fulfilled, (state, action: PayloadAction<ConfigurationElementsResult>) => {
        state.loading = false;
        state.draftConfigurationId = action.payload.draft_configuration_id || null;
        state.draftElementsCount = action.payload.draft_elements_count;
        state.elements = action.payload.configuration_elements || [];
      })
      .addCase(fetchConfigurationElements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при загрузке данных';
      })
      .addCase(addElementToDraft.fulfilled, (state, action: PayloadAction<{ id: number, newDraftCount: number }>) => {
        state.draftElementsCount = action.payload.newDraftCount;
      });
  },
});

// Экспортируем действия
export const { clearDraft } = configurationElementsSlice.actions;

// Экспортируем редьюсер
export default configurationElementsSlice.reducer;
