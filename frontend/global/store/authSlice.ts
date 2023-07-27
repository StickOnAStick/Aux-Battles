import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';
import { Users } from '../types/Users';
import { Admin } from 'pocketbase';

interface AuthState {
    isAuth: boolean
}

const initialState: AuthState = {
    isAuth: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<AuthState>) => {
            state.isAuth = action.payload.isAuth
        },
    },
})

export const { setAuth } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
