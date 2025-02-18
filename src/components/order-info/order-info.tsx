import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { fetchOneOrder, selectOrderState } from '../../services/slices/order';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>(); // Номер заказа из URL
  const orderNumber = Number(number);
  const dispatch = useDispatch();

  // Данные из Redux
  const { currentOrder, isLoading, errorMessage } =
    useSelector(selectOrderState);
  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.ingredients
  );

  // Загружаем данные заказа (если оно отсутствует)
  useEffect(() => {
    if (orderNumber && (!currentOrder || currentOrder.number !== orderNumber)) {
      dispatch(fetchOneOrder(orderNumber));
    }
  }, [dispatch, orderNumber, currentOrder]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!currentOrder || !ingredients.length) return null;

    const date = new Date(currentOrder.createdAt);

    const ingredientsInfo = currentOrder.ingredients.reduce(
      (acc, id) => {
        const ingredient = ingredients.find((ing) => ing._id === id);
        if (ingredient) {
          if (!acc[id]) {
            acc[id] = { ...ingredient, count: 1 };
          } else {
            acc[id].count++;
          }
        }
        return acc;
      },
      {} as { [key: string]: TIngredient & { count: number } }
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...currentOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [currentOrder, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!orderInfo) {
    return <div>Заказ не найден</div>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
