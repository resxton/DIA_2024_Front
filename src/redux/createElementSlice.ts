import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { ConfigurationElement } from '../api/Api';

interface ConfigurationElementState {
  element: ConfigurationElement | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConfigurationElementState = {
  element: null,
  loading: false,
  error: null,
};

// Create new configuration element
export const createConfigurationElement = createAsyncThunk(
  'configurationElement/create',
  async (
    { formData, imageFile }: { formData: ConfigurationElement; imageFile: File | null },
    { rejectWithValue }
  ) => {
    try {
      const newElementResponse = await api.planeConfigurationElements.planeConfigurationElementsCreate({
        ...formData,
      });

      const newElementId = newElementResponse.data.pk as unknown as string;

      if (imageFile) {
        await api.planeConfigurationElement
          .planeConfigurationElementEditCreate(newElementId, { pic: imageFile });
      }

      return newElementResponse.data;
    } catch (error) {
      return rejectWithValue('Ошибка при создании элемента');
    }
  }
);

// Update existing configuration element
export const updateConfigurationElement = createAsyncThunk(
  'configurationElement/update',
  async (
    { id, formData, imageFile }: { id: string; formData: ConfigurationElement; imageFile: File | null },
    { rejectWithValue }
  ) => {
    try {
      await api.planeConfigurationElement.planeConfigurationElementEditUpdate(id, formData);

      if (imageFile) {
        await api.planeConfigurationElement
          .planeConfigurationElementEditCreate(id, { pic: imageFile });
      }

      return formData;
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении элемента');
    }
  }
);

const createElementSlice = createSlice({
  name: 'configurationElement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createConfigurationElement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConfigurationElement.fulfilled, (state, action) => {
        state.loading = false;
        state.element = action.payload;
      })
      .addCase(createConfigurationElement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateConfigurationElement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConfigurationElement.fulfilled, (state, action) => {
        state.loading = false;
        state.element = action.payload;
      })
      .addCase(updateConfigurationElement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = createElementSlice.actions;

export default createElementSlice.reducer;
