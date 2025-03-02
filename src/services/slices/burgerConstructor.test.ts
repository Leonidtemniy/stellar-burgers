import constructorReducer, {
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetModal
} from './burgerConstructor';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';

describe('burgerConstructorSlice', () => {
  it('должен возвращать начальное состояние', () => {
    const state = constructorReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('Синхронные экшены', () => {
    it('должен добавлять булку', () => {
      const bun: TIngredient = {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 5,
        fat: 5,
        carbohydrates: 5,
        calories: 50,
        price: 100,
        image: 'image-url',
        image_large: 'image-large-url',
        image_mobile: 'image-mobile-url'
      };
      const action = addIngredient(bun);
      const state = constructorReducer(initialState, action);
      expect(state.constructorItems.bun).toEqual({
        ...bun,
        id: expect.any(String) // Проверяем, что id был добавлен
      });
    });

    it('должен добавлять ингредиент', () => {
      const ingredient: TIngredient = {
        _id: '2',
        name: 'Котлета',
        type: 'main',
        proteins: 10,
        fat: 10,
        carbohydrates: 10,
        calories: 100,
        price: 50,
        image: 'image-url',
        image_large: 'image-large-url',
        image_mobile: 'image-mobile-url'
      };
      const action = addIngredient(ingredient);
      const state = constructorReducer(initialState, action);
      expect(state.constructorItems.ingredients).toEqual([
        {
          ...ingredient,
          id: expect.any(String) // Проверяем, что id был добавлен
        }
      ]);
    });

    it('должен удалять ингредиент', () => {
      const ingredient: TConstructorIngredient = {
        _id: '2',
        name: 'Котлета',
        type: 'main',
        proteins: 10,
        fat: 10,
        carbohydrates: 10,
        calories: 100,
        price: 50,
        image: 'image-url',
        image_large: 'image-large-url',
        image_mobile: 'image-mobile-url',
        id: 'unique-id'
      };
      const stateWithIngredient = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [ingredient]
        }
      };
      const action = removeIngredient('unique-id');
      const state = constructorReducer(stateWithIngredient, action);
      expect(state.constructorItems.ingredients).toEqual([]);
    });

    it('должен перемещать ингредиент', () => {
      const ingredient1: TConstructorIngredient = {
        _id: '2',
        name: 'Котлета',
        type: 'main',
        proteins: 10,
        fat: 10,
        carbohydrates: 10,
        calories: 100,
        price: 50,
        image: 'image-url',
        image_large: 'image-large-url',
        image_mobile: 'image-mobile-url',
        id: 'unique-id-1'
      };
      const ingredient2: TConstructorIngredient = {
        _id: '3',
        name: 'Сыр',
        type: 'main',
        proteins: 5,
        fat: 5,
        carbohydrates: 5,
        calories: 50,
        price: 30,
        image: 'image-url',
        image_large: 'image-large-url',
        image_mobile: 'image-mobile-url',
        id: 'unique-id-2'
      };
      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [ingredient1, ingredient2]
        }
      };
      const action = moveIngredient({ fromIndex: 0, toIndex: 1 });
      const state = constructorReducer(stateWithIngredients, action);
      expect(state.constructorItems.ingredients).toEqual([
        ingredient2,
        ingredient1
      ]);
    });

    it('должен сбрасывать модальное окно', () => {
      const order: TOrder = {
        _id: '1',
        status: 'done',
        name: 'Order 1',
        createdAt: '2023-10-01T00:00:00.000Z',
        updatedAt: '2023-10-01T00:00:00.000Z',
        number: 1,
        ingredients: ['1', '2']
      };
      const stateWithModal = {
        ...initialState,
        orderModalData: order
      };
      const action = resetModal();
      const state = constructorReducer(stateWithModal, action);
      expect(state.orderModalData).toBeNull();
    });
  });
});
