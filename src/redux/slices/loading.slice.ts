import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AnyObject} from 'yup/lib/types';

interface LoadingState {
  loader: {
    isLoading: boolean;
    ops?: AnyObject;
  };
}

const initialState: LoadingState = {
  loader: {
    isLoading: false,
    ops: {},
  },
};

const slice = createSlice({
  name: 'overlay',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<LoadingState['loader']>) => {
      state.loader.isLoading = action.payload.isLoading;
      state.loader.ops = action.payload.ops ?? {};
    },
  },
});

export const {reducer: loadingReducer, actions: loadingActions} = slice;
