import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { AppDispatch, useSelector } from '../../services/store';
import { useDispatch } from 'react-redux';
import { fetchFeeds } from '../../services/slices/feed';

export const Feed: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const orders: TOrder[] = useSelector((state) => state.feeds.orders);
  const handleGetFeeds = () => {
    console.log('нажали кнопку');
    dispatch(fetchFeeds()); // Вызываем экшен для загрузки данных
  };
  // если надо загружаем данные при монтировании компонента
  // useEffect(() => {
  //   handleGetFeeds();
  // }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
