import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Guests, GuestsPayload } from '../types/Guests';
import { RootState } from './store';

const initialState: GuestsPayload = {
    username: '',
    currentLobby: '',
    currentGame: ''
}

export const guestSlice = createSlice({
    name: 'pocketbase',
    initialState,
    reducers: {
        setGuest: (state, action: PayloadAction<GuestsPayload>) => {
            state.id = action.payload.id,
            state.username = action.payload.username,
            state.currentLobby = action.payload.currentLobby,
            state.currentGame = action.payload.currentGame
        },
    },
});

export const { setGuest } = guestSlice.actions;

export const selectGuest = (state: RootState) => state.pocketbase;

export default guestSlice.reducer;