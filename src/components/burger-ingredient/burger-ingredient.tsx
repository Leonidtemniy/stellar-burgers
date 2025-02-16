// BurgerIngredient.tsx

import { FC, memo, useCallback } from 'react'; // memo и useCallback оптимизируют рендеринг
import { useLocation } from 'react-router-dom'; // Для сохранения background state
import { useDispatch } from '../../services/store';

import { BurgerIngredientUI } from '@ui'; // UI-компонент для отображения ингредиента
import { TBurgerIngredientProps } from './type'; // Типы для пропсов
import { addIngredient } from '../../services/slices/burgerConstructor'; // Экшен для добавления ингредиента

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation(); // Хук для доступа к состоянию маршрута
    const dispatch = useDispatch(); // Диспатч для вызова экшенов

    // Оптимизация функции добавления ингредиента через useCallback
    const handleAdd = useCallback(() => {
      dispatch(addIngredient(ingredient));
    }, [dispatch, ingredient]);

    return (
      <BurgerIngredientUI
        ingredient={ingredient} // Данные об ингредиенте
        count={count} // Количество добавлений
        locationState={{ background: location }} // Передача состояния для модального окна
        handleAdd={handleAdd} // Функция добавления
      />
    );
  }
);
