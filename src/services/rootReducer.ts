import { combineReducers } from '@reduxjs/toolkit';
import burgerConstructorReducer from '../services/slices/burgerConstructor';
import ingredientReducer from '../services/slices/ingredients';
import orderSlice from '../services/slices/order';
import feedReducer from '../services/slices/feed';
import userReducer from '../services/slices/user';

const rootReducer = combineReducers({
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  ingredients: ingredientReducer,
  order: orderSlice,
  user: userReducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
