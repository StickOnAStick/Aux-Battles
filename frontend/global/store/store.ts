import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer from './authSlice';
import pocketbaseSliceReducer from './pbSlice';
import guestSliceReducer from './guestSlice';

export const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        pocketbase: pocketbaseSliceReducer,
        guest: guestSliceReducer
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch;