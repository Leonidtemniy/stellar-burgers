import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchOrders, selectOrderState } from '../../services/slices/order';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orderList, isLoading, errorMessage } = useSelector(selectOrderState);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // if (isLoading) return <div>Загрузка...</div>;
  if (errorMessage) return <div>Ошибка: {errorMessage}</div>;

  return <ProfileOrdersUI orders={orderList} />;
};
