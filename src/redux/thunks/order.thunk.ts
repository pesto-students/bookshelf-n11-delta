import {createAsyncThunk} from '@reduxjs/toolkit';
import {batch} from 'react-redux';
import {toast} from 'react-toastify';
import {AnyObject} from 'yup/lib/types';
import {CartThunks} from '.';

import axios from '../../core/axios';
import environment from '../../Environment/environment';
import {CartItem} from '../../shared/models';
import {orderActions} from '../slices';

export const getOrders = createAsyncThunk(
  'order/getAll',
  async (_, {dispatch, fulfillWithValue, rejectWithValue}) => {
    try {
      dispatch(orderActions.setLoading(true));
      const {data} = await axios.get(`${environment.API_URL}/orders`);
      batch(() => {
        dispatch(orderActions.setLoaded());
        dispatch(orderActions.setItems(data.orders));
      });
      return fulfillWithValue(data as any);
    } catch (err) {
      throw rejectWithValue(err);
    } finally {
      dispatch(orderActions.setLoading(false));
    }
  },
);

export const OrderThunks = {getOrders};
