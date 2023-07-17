import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer from './authSlice';
import guestSliceReducer from './guestSlice';

export const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        guest: guestSliceReducer
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch;