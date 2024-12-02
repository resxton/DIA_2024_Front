import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Интерфейс состояния аутентификации
interface AuthState {
  isAuthenticated: boolean;
  user: { username: string | null; token: string | null; id: number | null };
}

// Функция для загрузки состояния аутентификации из localStorage
const loadAuthFromLocalStorage = () => {
  const savedAuth = localStorage.getItem('auth');
  return savedAuth ? JSON.parse(savedAuth) : { isAuthenticated: false, user: { username: null, token: null, id: null } };
};

// Функция для сохранения состояния аутентификации в localStorage
const saveAuthToLocalStorage = (auth: AuthState) => {
  localStorage.setItem('auth', JSON.stringify(auth));
};

// Начальное состояние, загружаем из localStorage
const initialState: AuthState = loadAuthFromLocalStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ username: string; token: string; id: number }>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      saveAuthToLocalStorage(state); // Сохраняем в localStorage
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = { username: null, token: null, id: null };
      saveAuthToLocalStorage(state); // Сохраняем в localStorage
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
