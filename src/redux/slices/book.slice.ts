import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import {Book} from '../../shared/models';

const adapter = createEntityAdapter<Book>({
  selectId: book => book._id,
});

const bookSlice = createSlice({
  name: 'book',
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

export const {reducer: bookReducer, actions: bookActions} = bookSlice;

export const bookSelectors = adapter.getSelectors();
