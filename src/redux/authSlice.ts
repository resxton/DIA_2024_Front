import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api';

// Интерфейс состояния аутентификации
interface AuthState {
  isAuthenticated: boolean;
  user: { 
    id: number | null;
    username: string | null; 
    token: string | null; 
    is_staff: boolean | null; 
  };
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

// const loadAuthFromLocalStorage = () => {
//   const savedAuth = localStorage.getItem('auth');
//   return savedAuth
//     ? JSON.parse(savedAuth)
//     : { isAuthenticated: false, user: { id: null, username: null, token: null, is_staff: null }, loading: 'idle', error: null };
// };

// const saveAuthToLocalStorage = (auth: AuthState) => {
//   localStorage.setItem('auth', JSON.stringify(auth));
// };

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

      // Логин пользователя с флагом withCredentials
      const response = await api.login.loginCreate({ username, password }, { withCredentials: true });

      if (response?.data.is_staff !== undefined) {
        const isStaff = response.data.is_staff;
        
        console.log(`Login successful for username: ${username}`);
        
        // Здесь получаем sessionid из cookie
        const sessionid = response.headers['Set-Cookie']
          ?.find((cookie: string) => cookie.startsWith('sessionid='))
          ?.split(';')[0]
          ?.split('=')[1];

        console.log('Session ID:', sessionid);

        return { id, username, token: 'no-token', is_staff: isStaff, sessionid }; 
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

const initialState: AuthState = {
  isAuthenticated: false,
  user: { id: null, username: null, token: null, is_staff: null },
  loading: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = { id: null, username: null, token: null, is_staff: null }; 
      state.error = null;
      // saveAuthToLocalStorage(state);
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
        // saveAuthToLocalStorage(state);
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
        state.user = { id: null, username: null, token: null, is_staff: null }; 
        state.loading = 'succeeded';
        state.error = null;
        // saveAuthToLocalStorage(state); 
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
