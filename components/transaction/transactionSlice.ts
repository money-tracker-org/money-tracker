import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Group } from 'lib/entity/Group';
import { Transaction } from '../../lib/entity/Transaction';
import { AppDispatch, AppGetState, RootState } from '../../pages/store';

export interface TransactionState {
    transcations: Transaction[]
    loading: boolean
    error?: Error
}

const initialState: TransactionState = {
    transcations: [],
    loading: false,
    error: undefined,
}

export const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        createNewTransactionSuccess: (
            state,
            action: PayloadAction<Transaction>
        ) => {
            state.transcations.push(action.payload)
            state.loading = false
        },
        fetchTransactionsStarted: (state) => {
            state.loading = true
        },
        fetchTransactionsError: (state, action: PayloadAction<Error>) => {
            state.error = action.payload
            state.loading = false
        },
        fetchTransactionsSuccess: (
            state,
            action: PayloadAction<Transaction[]>
        ) => {
            state.transcations = action.payload
            state.loading = false
        },
    },
})

export const fetchTransactions =
    (group: Group | null) => async (dispatch: AppDispatch, getState: AppGetState) => {
        if (!group?.gid) return
        dispatch(transactionSlice.actions.fetchTransactionsStarted())
        try {
            const response = await fetch(
                `${getState().global.backendUrl}/api/group/${group.gid}/transaction`
            )
            const users = await response.json()
            dispatch(transactionSlice.actions.fetchTransactionsSuccess(users))
        } catch (e) {
            dispatch(
                transactionSlice.actions.fetchTransactionsError(e as Error)
            )
        }
    }

export const transactionListSelector = (state: RootState) =>
    state.transaction.transcations
export const { createNewTransactionSuccess } = transactionSlice.actions
export default transactionSlice.reducer
