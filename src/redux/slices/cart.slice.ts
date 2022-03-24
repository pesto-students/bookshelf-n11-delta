import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import {CartItem} from '../../shared/models';

const adapter = createEntityAdapter<CartItem>({
  selectId: cart => cart._id,
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: adapter.getInitialState({
    loading: false,
    isLoaded: false,
  }),
  reducers: {
    addItems: adapter.addMany,
    addItem: adapter.addOne,
    setItems: adapter.setMany,
    setItem: adapter.setOne,
    upsertItem: adapter.upsertOne,
    removeItem: adapter.removeOne,
    addQuantity: adapter.updateOne,
    removeQuantity: adapter.removeOne,
    removeAll: adapter.removeAll,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoaded: state => {
      state.isLoaded = true;
    },
  },
});

export const {reducer: cartReducer, actions: cartActions} = cartSlice;

export const cartSelectors = adapter.getSelectors();
