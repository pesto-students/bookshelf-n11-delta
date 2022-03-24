import {createAsyncThunk} from '@reduxjs/toolkit';
import {AnyObject} from 'yup/lib/types';

import axios from '../../core/axios';
import environment from '../../Environment/environment';
import {Book, Review} from '../../shared/models';
import {bookActions, bookReviewActions} from '../slices';

export const getBookReviewsById = createAsyncThunk(
  'book-reviews/getbyId',
  async (id: string, {dispatch, fulfillWithValue, rejectWithValue}) => {
    try {
      dispatch(bookReviewActions.setLoading(true));
      const {data} = await axios.get(
        `${environment.API_URL}/reviews?bookId=${id}`,
      );
      const bookReviews = {
        bookId: id,
        reviews: data.reviews,
      };
      dispatch(bookReviewActions.upsertItem(bookReviews));
      return fulfillWithValue(data as any);
    } catch (err) {
      throw rejectWithValue(err);
    } finally {
      dispatch(bookReviewActions.setLoading(false));
    }
  },
);

export const addBookReview = createAsyncThunk(
  'book-reviews/createOne',
  async (
    payload: AnyObject,
    {dispatch, getState, fulfillWithValue, rejectWithValue},
  ) => {
    try {
      const {data} = await axios.post(
        `${environment.API_URL}/reviews/new`,
        payload,
      );
      const {bookReview} = getState() as AnyObject;
      const existingReviews =
        bookReview.entities[payload.bookId]?.reviews ?? [];
      const reviews = [...existingReviews, new Review(data)];
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);

      const avgRating = Math.floor(sum / reviews.length);
      dispatch(
        bookActions.upsertItem({_id: payload.bookId, avgRating} as Book),
      );
      dispatch(bookReviewActions.upsertItem({bookId: payload.bookId, reviews}));
      return fulfillWithValue(data as any);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const canPostReview = createAsyncThunk(
  'book-reviews/canPost',
  async (
    id: string,
    {dispatch, getState, fulfillWithValue, rejectWithValue},
  ) => {
    try {
      const {data} = await axios.post(
        `${environment.API_URL}/reviews/user/${id}`,
      );
      dispatch(bookReviewActions.upsertItem(data));
      return fulfillWithValue(data as any);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const BookReviewThunks = {
  getBookReviewsById,
  addBookReview,
  canPostReview,
};
