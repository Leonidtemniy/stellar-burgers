import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { getIngredientsSelector } from '../../services/slices/ingredients';

/** Компонент для отображения деталей ингредиента */
export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>(); // Получаем id ингредиента из параметров маршрута

  // Получаем данные всех ингредиентов через мемоизированный селектор
  const allIngredients = useSelector(getIngredientsSelector);

  // Ищем ингредиент по id
  const ingredientData = allIngredients.find(
    (ingredient) => ingredient._id === id
  );

  // Если ингредиент не найден, показываем лоадер
  if (!ingredientData) {
    return <Preloader />;
  }

  // Отображаем данные ингредиента
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
