import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import {BookReviewStoreModel} from '../../shared/models';

const adapter = createEntityAdapter<BookReviewStoreModel>({
  selectId: review => review.bookId,
});

const bookReviewSlice = createSlice({
  name: 'book-review',
  initialState: adapter.getInitialState({
    loading: false,
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
  },
});

export const {reducer: bookReviewReducer, actions: bookReviewActions} =
  bookReviewSlice;

export const bookReviewSelectors = adapter.getSelectors();
