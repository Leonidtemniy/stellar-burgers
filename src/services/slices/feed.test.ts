import feedReducer, {
  fetchFeeds,
  selectFeedsState,
  selectOrders,
  selectTotal,
  selectTotalToday,
  selectErrorMessage,
  selectFeedIsLoading
} from './feed';
import { TOrder } from '@utils-types';

// Начальное состояние
const initialState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  errorMessage: null
};

describe('feedSlice', () => {
  it('должен возвращать начальное состояние', () => {
    const state = feedReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('fetchFeeds', () => {
    it('должен обрабатывать состояние pending', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = feedReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.errorMessage).toBeNull();
    });

    it('должен обрабатывать состояние fulfilled', () => {
      const mockOrders: TOrder[] = [
        {
          _id: '1',
          ingredients: ['ingredient1', 'ingredient2'],
          status: 'done',
          name: 'Order 1',
          createdAt: '2023-10-01T00:00:00.000Z',
          updatedAt: '2023-10-01T00:00:00.000Z',
          number: 1
        }
      ];
      const mockPayload = {
        orders: mockOrders,
        total: 10,
        totalToday: 5
      };
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockPayload
      };
      const state = feedReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(10);
      expect(state.totalToday).toBe(5);
    });

    it('должен обрабатывать состояние rejected', () => {
      const errorMessage = 'Ошибка загрузки';
      const action = {
        type: fetchFeeds.rejected.type,
        error: { message: errorMessage }
      };
      const state = feedReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.errorMessage).toBe(errorMessage);
    });
  });

  describe('Селекторы', () => {
    const mockState = {
      feeds: {
        orders: [
          {
            _id: '1',
            ingredients: ['ingredient1', 'ingredient2'],
            status: 'done',
            name: 'Order 1',
            createdAt: '2023-10-01T00:00:00.000Z',
            updatedAt: '2023-10-01T00:00:00.000Z',
            number: 1
          }
        ],
        total: 10,
        totalToday: 5,
        isLoading: false,
        errorMessage: null
      }
    };

    it('selectFeedsState должен возвращать состояние фидов', () => {
      const result = selectFeedsState(mockState);
      expect(result).toEqual(mockState.feeds);
    });

    it('selectOrders должен возвращать заказы', () => {
      const result = selectOrders(mockState);
      expect(result).toEqual(mockState.feeds.orders);
    });

    it('selectTotal должен возвращать общее количество заказов', () => {
      const result = selectTotal(mockState);
      expect(result).toBe(10);
    });

    it('selectTotalToday должен возвращать количество заказов за сегодня', () => {
      const result = selectTotalToday(mockState);
      expect(result).toBe(5);
    });

    it('selectErrorMessage должен возвращать сообщение об ошибке', () => {
      const result = selectErrorMessage(mockState);
      expect(result).toBeNull();
    });

    it('selectFeedIsLoading должен возвращать состояние загрузки', () => {
      const result = selectFeedIsLoading(mockState);
      expect(result).toBe(false);
    });
  });
});
