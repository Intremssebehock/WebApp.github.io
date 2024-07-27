import { configureStore } from '@reduxjs/toolkit';
import scoreReducer from './Slices/ScoreSlice';
import pageReducer from './Slices/PageSlice';

export const store = configureStore({
  reducer: { score: scoreReducer, page: pageReducer },
});
