import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {toast} from 'react-toastify';
import {AnyObject} from 'yup/lib/types';
import {UserEntryState} from '../../components/UserEntry';
import {User, UserAddress} from '../../shared/models';
import {TokenService} from '../../shared/services';

import {RootState} from '../store';
import {AuthThunks} from '../thunks';

type AuthState = {
  user: User;
  isLoading: boolean;
  userEntryState: UserEntryState;
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
  userEntryState: UserEntryState.Closed,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    finalizeAuth: state => {
      state.userEntryState = UserEntryState.Closed;
      state.isLoading = false;
    },
    setModalStateOpen: (state, action: PayloadAction<UserEntryState>) => {
      state.userEntryState = action.payload;
    },
    logout: state => {
      TokenService.clearTokenPayload();
      toast.success('Logout successful');
    },
  },
  extraReducers: builder =>
    builder
      .addCase(AuthThunks.me.fulfilled, (state, {payload}: AnyObject) => {
        state.user = new User(payload);
      })
      .addCase(
        AuthThunks.updateUserInfo.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.user = {...state.user, ...action.payload};
        },
      )
      .addCase(
        AuthThunks.editUserAddress.fulfilled,
        (state, action: PayloadAction<any>) => {
          let {addresses} = state.user;
          addresses = addresses.map(address => {
            if (address._id === action.payload._id) {
              address = new UserAddress({...address, ...action.payload});
            }
            return address;
          });
          state.user = {...state.user, addresses};
        },
      )
      .addCase(
        AuthThunks.addUserAddress.fulfilled,
        (state, action: PayloadAction<AnyObject>) => {
          const {addresses} = state.user;
          const newAdd = new UserAddress(action.payload.address);
          addresses.push(newAdd);
          state.user = {...state.user, addresses};
        },
      ),
});

export const authReducer = authSlice.reducer;

export const authSelector = (state: RootState) => state.auth;

export const authActions = authSlice.actions;
