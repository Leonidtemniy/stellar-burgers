import { FC } from 'react';
import { useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';
import { TOrder } from '@utils-types';
import { createSelector } from '@reduxjs/toolkit';

// Селекторы для данных из стора
const selectFeedState = (state: any) => state.feeds;

// Селектор для получения заказов по статусу
const selectOrdersByStatus = createSelector(
  [(state: any) => state.feeds.orders, (_: any, status: string) => status],
  (orders: TOrder[], status: string) =>
    orders
      .filter((order: TOrder) => order.status === status)
      .map((order: TOrder) => order.number)
      .slice(0, 20)
);

// Основной компонент
export const FeedInfo: FC = () => {
  // Получение состояния фида
  const { orders, total, totalToday } = useSelector(selectFeedState);

  // Получение заказов по статусу
  const readyOrders = useSelector((state) =>
    selectOrdersByStatus(state, 'done')
  );
  const pendingOrders = useSelector((state) =>
    selectOrdersByStatus(state, 'pending')
  );

  // Отображение данных
  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
