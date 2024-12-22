import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { PlaneConfigurationResponse, Configuration, ConfigurationElement } from '../api/Api';
import { useNavigate } from 'react-router-dom'; // Для редиректа

// Типы данных
interface ConfigurationState {
  configuration: PlaneConfigurationResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConfigurationState = {
  configuration: null,
  loading: false,
  error: null,
};

// Асинхронный экшн для получения конфигурации по ID
export const fetchConfiguration = createAsyncThunk(
  'configuration/fetchConfiguration',
  async (id: number) => {
    const response = await api.planeConfiguration.planeConfigurationRead(id);
    return response.data as PlaneConfigurationResponse;
  }
);

// Асинхронный экшн для удаления элемента из конфигурации
export const deleteElement = createAsyncThunk(
  'configuration/deleteElement',
  async ({ configurationId, elementId }: { configurationId: number, elementId: number }) => {
    await api.configurationMap.configurationMapDelete(configurationId, elementId);
    return elementId; // Возвращаем ID удаленного элемента
  }
);

// Асинхронный экшн для обновления количества элемента
export const updateElementCount = createAsyncThunk(
  'configuration/updateElementCount',
  async ({ configurationId, elementId, count }: { configurationId: number, elementId: number, count: number }) => {
    await api.configurationMap.configurationMapUpdate({ count }, configurationId, elementId);
    return { elementId, count }; // Возвращаем ID элемента и обновленное количество
  }
);

// Асинхронный экшн для удаления конфигурации
export const deleteConfiguration = createAsyncThunk(
	'configuration/deleteConfiguration',
	async (configurationId: string) => {
	  await api.planeConfiguration.planeConfigurationDelete(configurationId);
	  return configurationId; // Возвращаем ID удаленной конфигурации
	}
  );
  
  // Асинхронный экшн для обновления конфигурации
  export const updateConfiguration = createAsyncThunk(
	'configuration/updateConfiguration',
	async ({ configurationId, updatedConfiguration }: { configurationId: string, updatedConfiguration: Configuration }) => {
	  await api.planeConfiguration.planeConfigurationUpdate(configurationId, updatedConfiguration);
	  return updatedConfiguration; // Возвращаем обновленную конфигурацию
	}
  );

export const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    clearConfiguration: (state) => {
      state.configuration = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfiguration.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConfiguration.fulfilled, (state, action) => {
        state.loading = false;
        state.configuration = action.payload;
      })
      .addCase(fetchConfiguration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при загрузке конфигурации';
      })
      .addCase(deleteElement.fulfilled, (state, action) => {
        if (state.configuration) {
          // Удаляем элемент из конфигурации
          state.configuration.configuration_elements = state.configuration.configuration_elements.filter(
            (element: { pk: number; }) => element.pk !== action.payload
          );
          // Удаляем из counts
          delete state.configuration.counts[action.payload];
        }
      })
      .addCase(updateElementCount.fulfilled, (state, action) => {
        if (state.configuration) {
          const { elementId, count } = action.payload;
          const elementIndex = state.configuration.configuration_elements.findIndex(
            (element: { pk: number; }) => element.pk === elementId
          );

          if (elementIndex !== -1) {
            if (count === 0) {
              // Если количество стало 0, удаляем элемент
              state.configuration.configuration_elements.splice(elementIndex, 1);
              delete state.configuration.counts[elementId]; // Удаляем счетчик для элемента
            } else {
              // Обновляем количество элемента
              state.configuration.counts[elementId] = action.payload.count;
            }
          }
        }
      })	
	  .addCase(deleteConfiguration.fulfilled, (state, action) => {
        state.configuration = null; // Очищаем конфигурацию после удаления
      })
      .addCase(updateConfiguration.fulfilled, (state, action) => {
        if (state.configuration) {
          state.configuration = { ...state.configuration, ...action.payload }; // Обновляем конфигурацию
        }
      });  
  }
});

// Экспорты
export const { clearConfiguration } = configurationSlice.actions;

export default configurationSlice.reducer;
