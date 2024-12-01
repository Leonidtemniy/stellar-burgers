import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

// Тип состояния
interface OrderState {
  orderList: TOrder[];
  currentOrder: TOrder | null;
  isLoading: boolean;
  errorMessage: string | null;
}

// Начальное состояние
const initialState: OrderState = {
  orderList: [],
  currentOrder: null,
  isLoading: false,
  errorMessage: null
};

// Асинхронные экшены
export const fetchOrders = createAsyncThunk('order/fetchOrders', async () => {
  const orders = await getOrdersApi(); // Возвращается массив заказов
  return orders;
});

export const fetchOneOrder = createAsyncThunk(
  'order/fetchOneOrder',
  async (orderNumber: number) => {
    const response = await getOrderByNumberApi(orderNumber); // Возвращается объект с массивом orders
    return response.orders[0];
  }
);

// Slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || 'Ошибка загрузки заказов';
      })
      .addCase(fetchOneOrder.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchOneOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOneOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

// Селекторы
export const selectOrderState = (state: { order: OrderState }) => state.order;

// Экспорт редьюсера
export default orderSlice.reducer;
