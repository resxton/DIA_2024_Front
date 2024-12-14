import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api';

// Интерфейс состояния аутентификации
interface AuthState {
  isAuthenticated: boolean;
  user: { 
    id: number | null; // Добавляем id
    username: string | null; 
    token: string | null; 
    is_staff: boolean | null; 
  };
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

// Функция для загрузки состояния аутентификации из localStorage
const loadAuthFromLocalStorage = () => {
  const savedAuth = localStorage.getItem('auth');
  return savedAuth
    ? JSON.parse(savedAuth)
    : { isAuthenticated: false, user: { id: null, username: null, token: null, is_staff: null }, loading: 'idle', error: null };
};

// Функция для сохранения состояния аутентификации в localStorage
const saveAuthToLocalStorage = (auth: AuthState) => {
  localStorage.setItem('auth', JSON.stringify(auth));
};

// Асинхронный thunk для логина
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log(`Logging in with username: ${username}, password: ${password}`);

      // Получаем ID пользователя по имени
      const userResponse = await api.user.userGetIdByUsername(username);
      const id = userResponse.data.id;

      // Логин пользователя
      const response = await api.login.loginCreate({ username, password });

      if (response?.data.is_staff !== undefined) {
        const isStaff = response.data.is_staff;
        
        console.log(`Login successful for username: ${username}`);
        
        return { id, username, token: 'no-token', is_staff: isStaff }; // Возвращаем id, username и is_staff
      } else {
        console.error("Ответ не содержит поля is_staff");
        return rejectWithValue('Ошибка: отсутствует поле is_staff');
      }

    } catch (error: any) {
      console.error(`Login failed for username: ${username}, error: ${error.message || 'Unknown error'}`);
      return rejectWithValue(error.message || 'Ошибка при входе в систему');
    }
  }
);

// Асинхронный thunk для логаута
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const { username } = state.auth.user;

      console.log(`Logging out user: ${username}`);

      await api.logout.logoutCreate();

      console.log(`Logout successful for username: ${username}`);
    } catch (error: any) {
      console.error(`Logout failed, error: ${error.message || 'Unknown error'}`);
      return rejectWithValue(error.message || 'Ошибка при выходе из системы');
    }
  }
);

// Начальное состояние, загружаем из localStorage
const initialState: AuthState = loadAuthFromLocalStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = { id: null, username: null, token: null, is_staff: null }; // Сбрасываем id
      state.error = null;
      saveAuthToLocalStorage(state); // Сохраняем в localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<{ id: number; username: string; token: string; is_staff: boolean }>) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = 'succeeded';
        saveAuthToLocalStorage(state); // Сохраняем в localStorage
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutAsync.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = { id: null, username: null, token: null, is_staff: null }; // Сбрасываем id
        state.loading = 'succeeded';
        state.error = null;
        saveAuthToLocalStorage(state); // Сохраняем в localStorage
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
