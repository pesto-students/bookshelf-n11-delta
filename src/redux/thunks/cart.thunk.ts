import {createAsyncThunk} from '@reduxjs/toolkit';
import {batch} from 'react-redux';
import {AnyObject} from 'yup/lib/types';

import axios from '../../core/axios';
import environment from '../../Environment/environment';
import {ADD_ITEM_TO_CART} from '../../shared/immutables';
import {CartItem} from '../../shared/models';
import {cartActions} from '../slices';

export const getCartItems = createAsyncThunk(
  'cart/getAll',
  async (_, {dispatch, fulfillWithValue, rejectWithValue}) => {
    try {
      dispatch(cartActions.setLoading(true));
      const {data} = await axios.get(`${environment.API_URL}/cart`);
      // we will use book id as cart id, bcoz cart item can be created
      // in UI too so need to have unique identifier persisting all times
      const cartItems = data.orderDetails.reduce((acc, item) => {
        acc.push(new CartItem(item));
        return acc;
      }, []);
      batch(() => {
        dispatch(cartActions.setLoaded());
        dispatch(cartActions.setItems(cartItems));
      });
      return fulfillWithValue(data as any);
    } catch (err) {
      throw rejectWithValue(err);
    } finally {
      dispatch(cartActions.setLoading(false));
    }
  },
);

export const updateCartItem = createAsyncThunk(
  'cart/updateOne',
  async (payload: AnyObject, {dispatch, fulfillWithValue, rejectWithValue}) => {
    try {
      const {data} = await axios.patch(`${environment.API_URL}/cart`, {
        orderDetails: payload.orderDetails,
      });
      if (payload.type === ADD_ITEM_TO_CART) {
        const cartItem = new CartItem({
          _id: payload.id,
          book: payload.book,
          quantity: 1,
        });
        dispatch(cartActions.upsertItem(cartItem));
      } else if (payload.value) {
        dispatch(
          cartActions.upsertItem({
            _id: payload.id,
            quantity: payload.value,
          } as CartItem),
        );
      } else {
        dispatch(cartActions.removeItem(payload.id));
      }
      return fulfillWithValue(data as any);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const CartThunks = {getCartItems, updateCartItem};
