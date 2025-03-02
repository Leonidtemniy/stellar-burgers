import ingredientsReducer, { getIngredientsList } from './ingredients'; // Импортируем редьюсер и другие сущности
import { TIngredient } from '@utils-types'; // Импортируем тип ингредиента
const initialState = {
  ingredients: [],
  isLoading: false,
  error: null
};

describe('ingredientsSlice', () => {
  it('должен возвращать начальное состояние', () => {
    const state = ingredientsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('должен обрабатывать состояние pending', () => {
    const action = { type: getIngredientsList.pending.type }; // Экшен pending
    const state = ingredientsReducer(initialState, action); // Вызываем редьюсер

    // Проверяем, что isLoading стал true, а error сброшен
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать состояние rejected', () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';
    const action = {
      type: getIngredientsList.rejected.type, // Экшен rejected
      error: { message: errorMessage } // Передаем ошибку
    };
    const state = ingredientsReducer(initialState, action); // Вызываем редьюсер

    // Проверяем, что isLoading стал false, а error содержит сообщение об ошибке
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('должен обрабатывать состояние fulfilled', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        price: 100,
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        image: '',
        image_large: '',
        image_mobile: ''
      },
      {
        _id: '2',
        name: 'Котлета',
        type: 'main',
        price: 200,
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];
    const action = {
      type: getIngredientsList.fulfilled.type, // Экшен fulfilled
      payload: mockIngredients // Передаем моковые данные
    };
    const state = ingredientsReducer(initialState, action); // Вызываем редьюсер

    // Проверяем, что isLoading стал false, error сброшен, и ingredients обновлен
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual(mockIngredients);
  });
});
