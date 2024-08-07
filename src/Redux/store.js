import { configureStore } from '@reduxjs/toolkit';
import scoreReducer from './Slices/ScoreSlice';
import pageReducer from './Slices/PageSlice';
import gameReducer from './Slices/GameSlice';

export const store = configureStore({
  reducer: { score: scoreReducer, page: pageReducer, game: gameReducer },
});
