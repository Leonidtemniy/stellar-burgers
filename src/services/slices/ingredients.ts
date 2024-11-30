import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api'; // импорт API

// Тип состояния
interface IngredientsState {
  ingredientsData: any;
  buns: TIngredient[]; // Категория булок
  mains: TIngredient[]; // Категория основных ингредиентов
  sauces: TIngredient[]; // Категория соусов
  loading: boolean; // Состояние загрузки
  error: string | null; // Сообщение об ошибке
  selectedIngredient: TIngredient | null; // Выбранный ингредиент
}

// Начальное состояние
const initialState: IngredientsState = {
  buns: [],
  mains: [],
  sauces: [],
  loading: false,
  error: null,
  selectedIngredient: null,
  ingredientsData: undefined
};

// Асинхронный thunk для загрузки ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getIngredientsApi();
      return data as TIngredient[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Создание слайса
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setSelectedIngredient(state, action: PayloadAction<TIngredient | null>) {
      state.selectedIngredient = action.payload; // Устанавливаем выбранный ингредиент
    },
    clearSelectedIngredient(state) {
      state.selectedIngredient = null; // Очищаем выбранный ингредиент
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        // Распределяем ингредиенты по категориям
        state.buns = action.payload.filter((item) => item.type === 'bun');
        state.mains = action.payload.filter((item) => item.type === 'main');
        state.sauces = action.payload.filter((item) => item.type === 'sauce');
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    getIngredientsSelector(state: IngredientsState) {
      return [...state.buns, ...state.mains, ...state.sauces];
    }
  }
});

// Экспортируем действия
export const { setSelectedIngredient, clearSelectedIngredient } =
  ingredientsSlice.actions;

// Экспортируем селектор
export const { getIngredientsSelector } = ingredientsSlice.selectors;

// Экспортируем редюсер
export default ingredientsSlice.reducer;
