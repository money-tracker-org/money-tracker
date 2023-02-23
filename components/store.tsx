import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import groupSlice from 'components/group/groupSlice';
import transactionFormSlice from 'components/transaction/transactionFormSlice';
import transactionSlice from 'components/transaction/transactionSlice';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

interface GlobalState {
    backendUrl: string
}

const initialState: GlobalState = {
    backendUrl: 'http://localhost:3000',
}

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setBackendUrl: (state, action: PayloadAction<string>) => {
            state.backendUrl = action.payload
        },
    },
})

export const { setBackendUrl } = globalSlice.actions

export const store = configureStore({
    reducer: {
        global: globalSlice.reducer,
        transaction: transactionSlice,
        transactionForm: transactionFormSlice,
        group: groupSlice,
    },
})

interface AppStoreProps {
    children?: React.ReactNode;
}
const AppStore = ({ children }: AppStoreProps) => {
    if (typeof window !== 'undefined') {
        const currentHost = `${window.location.protocol}//${window.location.host}`
        if (store.getState().global.backendUrl !== currentHost) {
            store.dispatch(setBackendUrl(currentHost))
        }
    }
    useEffect(() => {
        Notification.requestPermission()
    }, [])
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default AppStore