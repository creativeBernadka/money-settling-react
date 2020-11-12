import { configureStore } from '@reduxjs/toolkit';
import settlementReducer from './settlementSlice';

export default configureStore({
  reducer: {
    settlement: settlementReducer,
  },
});
