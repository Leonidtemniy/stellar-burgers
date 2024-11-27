import { combineReducers } from '@reduxjs/toolkit';
import burgerConstructorReducer from '../services/slices/burgerConstructor';

import feedReducer from '../services/slices/feed';

const rootReducer = combineReducers({
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
