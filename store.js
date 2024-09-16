
import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './slices/fileSlice';
import searchReducer from './slices/searchSlice';

export const store = configureStore({
  reducer: {
    file: fileReducer,
    search: searchReducer,
  },
});