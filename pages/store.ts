import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import groupSlice from '../components/group/groupSlice'
import transactionFormSlice from '../components/transaction/transactionFormSlice'
import transactionSlice from '../components/transaction/transactionSlice'

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

export type RootState = ReturnType<typeof store.getState>
export type AppGetState = typeof store.getState
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
