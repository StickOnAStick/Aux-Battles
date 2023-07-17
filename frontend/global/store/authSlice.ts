import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';
import { Users } from '../types/Users';
import { Admin } from 'pocketbase';

interface AuthState {
    model: Users | Admin | null
}

const initialState: AuthState = {
    model: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<AuthState>) => {
            state.model = action.payload.model
        },
    },
})

export const { setAuth } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
