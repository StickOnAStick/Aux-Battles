import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import PocketBase from 'pocketbase';

export interface PocketbaseState {
    connection: PocketBase | null;
}

const initialState: PocketbaseState = {
    connection: null
}

export const pocketbaseSlice = createSlice({
    name: 'pocketbase',
    initialState,
    reducers: {
        setConnection: (state, action: PayloadAction<PocketbaseState>) => {
            state.connection = action.payload.connection;
        },
    },
});

export const { setConnection } = pocketbaseSlice.actions;

export const selectPbConnection = (state: RootState) => state.pocketbase;

export default pocketbaseSlice.reducer;