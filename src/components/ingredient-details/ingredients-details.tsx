import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import {
  getIngredientsList,
  selectIngredients,
  selectError
} from '../../services/slices/ingredients';
import { selectIngredientsIsLoading } from '../../services/slices/ingredients';

import { AppDispatch } from '../../services/store'; // Импортируйте тип dispatch

/** Компонент для отображения деталей ингредиента */
export const IngredientsDetails: FC = () => {
  const { id } = useParams<{ id: string }>(); // Получаем id ингредиента из параметров маршрута
  const dispatch = useDispatch(); // Типизируем dispatch

  // Получаем данные всех ингредиентов, флаг загрузки и ошибку из состояния Redux
  const allIngredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIngredientsIsLoading);
  const error = useSelector(selectError);

  // Загружаем ингредиенты при монтировании компонента, если они еще не загружены
  useEffect(() => {
    if (allIngredients.length === 0) {
      dispatch(getIngredientsList());
    }
  }, [allIngredients.length, dispatch]); // Добавлен `dispatch` и `allIngredients.length` в зависимости

  // Ищем ингредиент по id
  const ingredientData = allIngredients.find(
    (ingredient) => ingredient._id === id
  );

  // Если ингредиент не найден или идет загрузка, показываем лоадер
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!ingredientData) {
    return <div>Ингредиент не найден</div>;
  }

  // Отображаем данные ингредиента
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
