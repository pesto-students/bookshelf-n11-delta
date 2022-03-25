import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {batch} from 'react-redux';

import appAxios from '../../core/axios';
import environment from '../../Environment/environment';
import {bookActions} from '../slices';

const getBooks = createAsyncThunk(
  'books/getAll',
  async (_, {dispatch, fulfillWithValue, rejectWithValue}) => {
    try {
      dispatch(bookActions.setLoading(true));
      const {data} = await axios.get(`${environment.API_URL}/books`);
      batch(() => {
        dispatch(bookActions.setLoading(false));
        dispatch(bookActions.setLoaded());
        dispatch(bookActions.setItems(data.books));
      });
      return fulfillWithValue(data as any);
    } catch (err) {
      dispatch(bookActions.setLoading(false));
      throw rejectWithValue(err);
    }
  },
);

const getBookById = createAsyncThunk(
  'book/getById',
  async (id: string, {dispatch, fulfillWithValue, rejectWithValue}) => {
    try {
      dispatch(bookActions.setLoading(true));
      const {data} = await appAxios.get(`${environment.API_URL}/book/${id}`);
      batch(() => {
        dispatch(bookActions.addItem(data));
      });
      return fulfillWithValue(data as any);
    } catch (err) {
      throw rejectWithValue(err);
    } finally {
      dispatch(bookActions.setLoading(false));
    }
  },
);

export const BookThunks = {getBooks, getBookById};
