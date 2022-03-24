import {AnyAction, combineReducers, configureStore} from '@reduxjs/toolkit';

import {
  authReducer,
  bookReducer,
  bookReviewReducer,
  cartReducer,
  loadingReducer,
  orderReducer,
} from './slices';

const combineReducer = combineReducers({
  auth: authReducer,
  book: bookReducer,
  bookReview: bookReviewReducer,
  cart: cartReducer,
  generic: loadingReducer,
  order: orderReducer,
});

const rootReducer = (state, action: AnyAction) => {
  if (action.type === 'auth/logout') {
    state = undefined;
  }
  return combineReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});

export type RootState = ReturnType<typeof store.getState>;

export type RootDispatch = typeof store.dispatch;

export default store;
