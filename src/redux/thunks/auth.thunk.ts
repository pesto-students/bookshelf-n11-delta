import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {GoogleLoginResponse} from 'react-google-login';
import {batch} from 'react-redux';
import {toast} from 'react-toastify';
import {AnyObject} from 'yup/lib/types';

import appAxios from '../../core/axios';
import environment from '../../Environment/environment';
import {User, UserAddress} from '../../shared/models';
import {TokenService} from '../../shared/services';
import {AuthCreds} from '../../shared/types';
import {authActions} from '../slices';
import {CartThunks} from './cart.thunk';

export const me = createAsyncThunk(
  'auth/me',
  async (_, {dispatch, fulfillWithValue, rejectWithValue}) => {
    return appAxios
      .get(`${environment.API_URL}/me`)
      .then(({data}) => {
        if (!data.isSuperAdmin) {
          dispatch(CartThunks.getCartItems());
        }
        return fulfillWithValue(data as User);
      })
      .catch(error => rejectWithValue(error));
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (payload: AuthCreds, {dispatch, fulfillWithValue, rejectWithValue}) => {
    return new Promise((resolve, reject) => {
      appAxios
        .post(`${environment.API_URL}/login`, {
          email: payload.email,
          password: payload.password,
        })
        .then(({data}) => {
          TokenService.setTokenPayload(data);
          batch(() => {
            dispatch(authActions.setLoading(false));
            dispatch(me())
              .unwrap()
              .then((user: AnyObject) => {
                resolve(fulfillWithValue(data) as any);
                toast.success(`Welcome ${user.username}`);
              });
          });
        })
        .catch(error => reject(rejectWithValue(error)))
        .finally(() => {
          dispatch(authActions.finalizeAuth());
        });
    });
  },
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (
    payload: GoogleLoginResponse,
    {dispatch, fulfillWithValue, rejectWithValue},
  ) => {
    return new Promise((resolve, reject) => {
      dispatch(authActions.setLoading(true));
      appAxios
        .post(`${environment.API_URL}/google-login`, {
          token: payload.tokenId,
        })
        .then(({data}) => {
          TokenService.setTokenPayload(data);
          dispatch(me())
            .unwrap()
            .then((user: AnyObject) => {
              resolve(fulfillWithValue(data) as any);
              toast.success(`Welcome ${user.username}`);
            });
        })
        .catch(error => reject(rejectWithValue(error)))
        .finally(() => {
          dispatch(authActions.finalizeAuth());
        });
    });
  },
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (
    payload: AuthCreds & {name: string},
    {dispatch, fulfillWithValue, rejectWithValue},
  ) => {
    return appAxios
      .post(`${environment.API_URL}/signup`, {
        name: payload.name,
        email: payload.email,
        password: payload.password,
      })
      .then(() => {
        dispatch(login({email: payload.email, password: payload.password}))
          .unwrap()
          .then(data => fulfillWithValue(data));
      })
      .catch(error => rejectWithValue(error));
  },
);

export const refresh = createAsyncThunk(
  'auth/refresh',
  async (_, {dispatch, fulfillWithValue}) => {
    return new Promise(resolve => {
      const refreshToken = TokenService.getRefreshToken();
      if (refreshToken) {
        axios
          .post(`${environment.API_URL}/refresh`, {refreshToken})
          .then(({data}) => {
            TokenService.setTokenPayload(data);
            dispatch(me())
              .unwrap()
              .then(() => resolve(fulfillWithValue({}) as any));
          })
          .catch(() => {
            dispatch(authActions.logout);
            return resolve(fulfillWithValue({}) as any);
          });
      }
      resolve(fulfillWithValue({}) as any);
    });
  },
);

export const updateUserInfo = createAsyncThunk(
  'auth/userInfo',
  async (payload: AnyObject, {fulfillWithValue, rejectWithValue}) => {
    return new Promise((resolve, reject) => {
      appAxios
        .post(`${environment.API_URL}/me`, payload)
        .then(() => {
          const address = new UserAddress(payload);
          const user = {
            username: payload.username,
            addresses: [address],
          };
          resolve(fulfillWithValue(user) as any);
        })
        .catch(err => reject(rejectWithValue(err) as any));
    });
  },
);

export const addUserAddress = createAsyncThunk(
  'auth/user/add-address',
  async (address: UserAddress, {fulfillWithValue, rejectWithValue}) => {
    return new Promise((resolve, reject) => {
      appAxios
        .post(`${environment.API_URL}/cart/address`, {address})
        .then(() => {
          resolve(fulfillWithValue(address) as any);
        })
        .catch(err => reject(rejectWithValue(err) as any));
    });
  },
);

export const AuthThunks = {
  me,
  login,
  googleLogin,
  signUp,
  refresh,
  updateUserInfo,
  addUserAddress,
};
