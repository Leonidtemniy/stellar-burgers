import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

// Асинхронный thunk для загрузки ингредиентов
export const getIngredientsList = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null | undefined;
};

// Начальное состояние
export const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

// Создание слайса
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredientsList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getIngredientsList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

// Селекторы
export const selectIngredients = (state: { ingredients: TIngredientsState }) =>
  state.ingredients.ingredients;

export const selectIngredientsIsLoading = (state: {
  ingredients: TIngredientsState;
}) => state.ingredients.isLoading;

export const selectError = (state: { ingredients: TIngredientsState }) =>
  state.ingredients.error;

// Экспорт редьюсера
export default ingredientsSlice.reducer;
