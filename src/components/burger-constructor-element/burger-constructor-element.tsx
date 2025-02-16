import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui'; // UI компонент
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { removeIngredient, moveIngredient } from '@slices'; // Исправлено на moveIngredient

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Перемещаем ингредиент в бургере вниз
    const handleMoveDown = () => {
      dispatch(moveIngredient({ fromIndex: index, toIndex: index + 1 }));
    };

    // Перемещаем ингредиент в бургере вверх
    const handleMoveUp = () => {
      dispatch(moveIngredient({ fromIndex: index, toIndex: index - 1 }));
    };

    // Удаляем ингредиент из бургера
    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
