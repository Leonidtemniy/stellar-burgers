import { expect, test } from '@jest/globals';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import rootReducer from '../rootReducer';
import burgerConstructorReducer from '../slices/burgerConstructor';
import ingredientReducer from '../slices/ingredients';
import orderReducer from '../slices/order';
import feedReducer from '../slices/feed';
import userReducer from '../slices/user';

describe('тесты инициализации rootReducer', () => {
  test('Проверка инициализации rootReducer', () => {
    // Создаем хранилище с использованием rootReducer
    const store = configureStore({
      reducer: rootReducer
    });

    // Получаем состояние хранилища
    const storeState = store.getState();

    // Вызываем rootReducer с пустым состоянием и неизвестным экшеном
    const testState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что состояние хранилища и состояние rootReducer совпадают
    expect(testState).toEqual(storeState);
  });

  test('Проверка структуры rootReducer', () => {
    // Вручную создаем rootReducer для проверки структуры
    const manualRootReducer = combineReducers({
      burgerConstructor: burgerConstructorReducer,
      feeds: feedReducer,
      ingredients: ingredientReducer,
      order: orderReducer,
      user: userReducer
    });

    // Вызываем ручной rootReducer с пустым состоянием и неизвестным экшеном
    const manualState = manualRootReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });

    // Вызываем rootReducer с пустым состоянием и неизвестным экшеном
    const testState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что состояние ручного rootReducer и rootReducer совпадают
    expect(testState).toEqual(manualState);
  });
});
