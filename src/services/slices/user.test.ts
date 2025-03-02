import userReducer, {
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
  updateUserThunk,
  getUserThunk,
  clearUserError
} from './user';
import { TUser } from '@utils-types';
const initialState = {
  isLoading: false,
  user: null,
  isAuthorized: false,
  error: null,
  errorCode: null
};

describe('userSlice', () => {
  it('должен возвращать начальное состояние', () => {
    const state = userReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('должен обрабатывать clearUserError', () => {
    const stateWithError = {
      ...initialState,
      error: 'Ошибка',
      errorCode: 500
    };
    const state = userReducer(stateWithError, clearUserError());
    expect(state.error).toBeNull();
    expect(state.errorCode).toBeNull();
  });

  describe('loginUserThunk', () => {
    it('должен обрабатывать состояние pending', () => {
      const action = { type: loginUserThunk.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать состояние fulfilled', () => {
      const mockUser: TUser = { name: 'John Doe', email: 'john@example.com' };
      const action = {
        type: loginUserThunk.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthorized).toBe(true);
    });

    it('должен обрабатывать состояние rejected', () => {
      const errorMessage = 'Ошибка входа';
      const action = {
        type: loginUserThunk.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('registerUserThunk', () => {
    it('должен обрабатывать состояние pending', () => {
      const action = { type: registerUserThunk.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать состояние fulfilled', () => {
      const mockUser: TUser = { name: 'Jane Doe', email: 'jane@example.com' };
      const action = {
        type: registerUserThunk.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthorized).toBe(true);
    });

    it('должен обрабатывать состояние rejected', () => {
      const errorMessage = 'Ошибка регистрации';
      const action = {
        type: registerUserThunk.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('logoutUserThunk', () => {
    it('должен обрабатывать состояние pending', () => {
      const action = { type: logoutUserThunk.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать состояние fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: { name: 'John Doe', email: 'john@example.com' },
        isAuthorized: true
      };
      const action = { type: logoutUserThunk.fulfilled.type };
      const state = userReducer(stateWithUser, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthorized).toBe(false);
    });

    it('должен обрабатывать состояние rejected', () => {
      const errorMessage = 'Ошибка выхода';
      const action = {
        type: logoutUserThunk.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('updateUserThunk', () => {
    it('должен обрабатывать состояние pending', () => {
      const action = { type: updateUserThunk.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать состояние fulfilled', () => {
      const mockUser: TUser = { name: 'John Doe', email: 'john@example.com' };
      const action = {
        type: updateUserThunk.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
    });

    it('должен обрабатывать состояние rejected', () => {
      const errorMessage = 'Ошибка обновления';
      const action = {
        type: updateUserThunk.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('getUserThunk', () => {
    it('должен обрабатывать состояние pending', () => {
      const action = { type: getUserThunk.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать состояние fulfilled', () => {
      const mockUser: TUser = { name: 'John Doe', email: 'john@example.com' };
      const action = {
        type: getUserThunk.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthorized).toBe(true);
    });

    it('должен обрабатывать состояние rejected', () => {
      const errorMessage = 'Ошибка получения данных';
      const action = {
        type: getUserThunk.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
