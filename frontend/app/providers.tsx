'use client';
import { store } from "../global/store/store";
import { Provider } from 'react-redux';

export default function Providers({
    children
    }: {
    children: React.ReactNode
  }) {
    
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}