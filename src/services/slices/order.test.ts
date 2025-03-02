import orderReducer from './order';
import { TOrder } from '@utils-types';

const initialState = {
  orderList: [],
  currentOrder: null,
  isLoading: false,
  errorMessage: null
};

describe('orderSlice', () => {
  it('должен возвращать начальное состояние', () => {
    const state = orderReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('Синхронные изменения состояния', () => {
    it('должен обрабатывать состояние pending для fetchOrders', () => {
      const action = { type: 'order/fetchOrders/pending' };
      const state = orderReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.errorMessage).toBeNull();
    });

    it('должен обрабатывать состояние fulfilled для fetchOrders', () => {
      const mockOrders: TOrder[] = [
        {
          _id: '1',
          status: 'done',
          name: 'Order 1',
          createdAt: '2023-10-01T00:00:00.000Z',
          updatedAt: '2023-10-01T00:00:00.000Z',
          number: 1,
          ingredients: ['1', '2']
        }
      ];
      const action = {
        type: 'order/fetchOrders/fulfilled',
        payload: mockOrders
      };
      const state = orderReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.orderList).toEqual(mockOrders);
    });

    it('должен обрабатывать состояние rejected для fetchOrders', () => {
      const errorMessage = 'Ошибка загрузки заказов';
      const action = {
        type: 'order/fetchOrders/rejected',
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.errorMessage).toBe(errorMessage);
    });

    it('должен обрабатывать состояние pending для fetchOneOrder', () => {
      const action = { type: 'order/fetchOneOrder/pending' };
      const state = orderReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.errorMessage).toBeNull();
    });

    it('должен обрабатывать состояние fulfilled для fetchOneOrder', () => {
      const mockOrder: TOrder = {
        _id: '1',
        status: 'done',
        name: 'Order 1',
        createdAt: '2023-10-01T00:00:00.000Z',
        updatedAt: '2023-10-01T00:00:00.000Z',
        number: 1,
        ingredients: ['1', '2']
      };
      const action = {
        type: 'order/fetchOneOrder/fulfilled',
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
    });

    it('должен обрабатывать состояние rejected для fetchOneOrder', () => {
      const errorMessage = 'Ошибка загрузки заказа';
      const action = {
        type: 'order/fetchOneOrder/rejected',
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.errorMessage).toBe(errorMessage);
    });
  });
});
