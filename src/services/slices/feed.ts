import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

// Тип состояния
interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  errorMessage: string | null;
}

// Начальное состояние
const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  errorMessage: null
};

// Асинхронный thunk для получения фидов
export const fetchFeeds = createAsyncThunk('feeds/fetchFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});

// Слайс
const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка состояния при запросе
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (
          state,
          action: PayloadAction<{
            orders: TOrder[];
            total: number;
            totalToday: number;
          }>
        ) => {
          state.isLoading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || 'Неизвестная ошибка';
      });
  }
});

// Селекторы
export const selectFeedsState = (state: { feeds: FeedState }) => state.feeds;
export const selectOrders = (state: { feeds: FeedState }) => state.feeds.orders;
export const selectTotal = (state: { feeds: FeedState }) => state.feeds.total;
export const selectTotalToday = (state: { feeds: FeedState }) =>
  state.feeds.totalToday;
export const selectErrorMessage = (state: { feeds: FeedState }) =>
  state.feeds.errorMessage;
export const selectFeedIsLoading = (state: { feeds: FeedState }) =>
  state.feeds.isLoading;

// Экспорт редюсера
export default feedSlice.reducer;
