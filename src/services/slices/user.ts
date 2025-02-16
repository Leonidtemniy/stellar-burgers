import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from '../../utils/cookie';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '../../utils/burger-api';
import { TRegisterData, TLoginData } from '@api';
import { TUser } from '@utils-types';

export interface UserState {
  isLoading: boolean;
  user: TUser | null;
  isAuthorized: boolean;
  error: string | null;
  errorCode: number | null; // Код ошибки, если нужно
}

const initialState: UserState = {
  isLoading: false,
  user: null,
  isAuthorized: false,
  error: null,
  errorCode: null
};

// Async Thunks
export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => {
    const response = await loginUserApi(loginData);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (registerData: TRegisterData) => {
    const response = await registerUserApi(registerData);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const logoutUserThunk = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const updateUserThunk = createAsyncThunk(
  'user/update',
  (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const getUserThunk = createAsyncThunk('user/get', getUserApi);
// export const getUserThunk = createAsyncThunk('user/get', async () => {
//   console.log('Fetching user data...');
//   const response = await getUserApi();
//   console.log('User data received:', response);
//   return response;
// });

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
      state.errorCode = null; // Очищаем код ошибки
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(loginUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.errorCode = null;
        state.user = payload.user;
        state.isAuthorized = true;
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(registerUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(registerUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.errorCode = null;
        state.user = payload.user;
        state.isAuthorized = true;
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(logoutUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.errorCode = null;
        state.user = null;
        state.isAuthorized = false;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(updateUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.errorCode = null;
        state.user = payload.user;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(getUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(getUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.errorCode = null;
        state.user = payload.user;
        state.isAuthorized = true;
      });
  }
});

export const { clearUserError } = userSlice.actions;

export const isAuthorizedSelector = (state: { user: UserState }) =>
  state.user.isAuthorized;
export const getRequestUser = (state: { user: UserState }) =>
  state.user.isLoading;

// Селектор для получения user
export const getUserSelector = (state: { user: UserState }) => state.user.user;

export default userSlice.reducer;
