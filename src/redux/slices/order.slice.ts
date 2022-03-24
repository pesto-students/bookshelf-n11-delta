import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import {OrderModel} from '../../shared/models';

const adapter = createEntityAdapter<OrderModel>({
  selectId: order => order._id,
});

const orderSlice = createSlice({
  name: 'order',
  initialState: adapter.getInitialState({
    loading: false,
    isLoaded: false,
  }),
  reducers: {
    addItems: adapter.addMany,
    addItem: adapter.addOne,
    setItems: adapter.setMany,
    setItem: adapter.setOne,
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
    refreshData: state => {
      state.isLoaded = false;
    },
  },
});

export const {reducer: orderReducer, actions: orderActions} = orderSlice;

export const orderSelectors = adapter.getSelectors();
