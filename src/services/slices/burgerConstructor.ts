import {
  createSlice,
  createAsyncThunk,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

// Тип состояния
interface ConstructorState {
  isLoading: boolean;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderModalData: TOrder | null;
  errorMessage: string | null;
}

// Начальное состояние
const initialState: ConstructorState = {
  isLoading: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderModalData: null,
  errorMessage: null
};

// Асинхронный thunk для отправки заказа
export const sendOrder = createAsyncThunk(
  'constructor/sendOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Слайс
const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление ингредиента
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const id = nanoid();
      const newIngredient: TConstructorIngredient = { ...action.payload, id };

      if (action.payload.type === 'bun') {
        state.constructorItems.bun = newIngredient;
      } else {
        state.constructorItems.ingredients.push(newIngredient);
      }
    },

    // Удаление ингредиента
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },

    // Перемещение ингредиента
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredients = state.constructorItems.ingredients;

      if (toIndex >= 0 && toIndex < ingredients.length) {
        const [movedItem] = ingredients.splice(fromIndex, 1);
        ingredients.splice(toIndex, 0, movedItem);
      }
    },

    // Сброс модального окна
    resetModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModalData = action.payload.order;
        state.constructorItems = { bun: null, ingredients: [] };
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload as string;
      });
  }
});

// Экспорт действий
export const { addIngredient, removeIngredient, moveIngredient, resetModal } =
  constructorSlice.actions;

// Экспорт редюсера
export default constructorSlice.reducer;
