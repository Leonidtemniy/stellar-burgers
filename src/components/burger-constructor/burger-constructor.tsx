import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { sendOrder, resetModal } from '@slices';
import { RootState } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Типизируем состояние через RootState
  const constructorItems = useSelector(
    (state: RootState) => state.burgerConstructor.constructorItems
  );
  const orderRequest = useSelector(
    (state: RootState) => state.burgerConstructor.isLoading
  );
  const orderModalData = useSelector(
    (state: RootState) => state.burgerConstructor.orderModalData
  );

  const ingredients = useMemo(() => {
    const bun = constructorItems.bun?._id;
    const ingredientIds = constructorItems.ingredients.map(
      (ingredient) => ingredient._id
    );
    return bun ? [bun, ...ingredientIds, bun] : ingredientIds;
  }, [constructorItems]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum, ingredient: TConstructorIngredient) => sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  const onOrderClick = () => {
    if (constructorItems.bun) {
      dispatch(sendOrder(ingredients));
    } else {
      navigate('/login');
    }
  };

  const closeOrderModal = () => {
    dispatch(resetModal());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
