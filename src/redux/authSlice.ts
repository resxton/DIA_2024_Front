import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api';

// Интерфейс состояния аутентификации
interface AuthState {
  isAuthenticated: boolean;
  user: { username: string | null; token: string | null; id: number | null };
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

// Функция для загрузки состояния аутентификации из localStorage
const loadAuthFromLocalStorage = () => {
  const savedAuth = localStorage.getItem('auth');
  return savedAuth
    ? JSON.parse(savedAuth)
    : { isAuthenticated: false, user: { username: null, token: null, id: null }, loading: 'idle', error: null };
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
      console.log(`Logging in with username: ${username}, password: ${password}`); // Логируем перед запросом

      // Отправляем данные для аутентификации
      const response = await api.login.loginCreate({ username, password });

      // Получаем ID пользователя по имени
      const userResponse = await api.user.userGetIdByUsername(username);
      const id = userResponse.data.id;

      console.log(`Login successful for username: ${username}`); // Логируем после успешного логина

      return { username, token: 'no-token', id }; // Здесь подставьте реальный токен, если он используется
    } catch (error: any) {
      console.error(`Login failed for username: ${username}, error: ${error.message || 'Unknown error'}`); // Логируем в случае ошибки
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
      const { username } = state.auth.user; // Получаем имя пользователя перед логаутом

      console.log(`Logging out user: ${username}`); // Логируем перед логаутом

      await api.logout.logoutCreate();

      console.log(`Logout successful for username: ${username}`); // Логируем после успешного логаута
    } catch (error: any) {
      console.error(`Logout failed, error: ${error.message || 'Unknown error'}`); // Логируем в случае ошибки
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
      state.user = { username: null, token: null, id: null };
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
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<{ username: string; token: string; id: number }>) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = 'succeeded';
        saveAuthToLocalStorage(state);
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
        state.user = { username: null, token: null, id: null };
        state.loading = 'succeeded';
        state.error = null;
        saveAuthToLocalStorage(state);
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
