import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { apiClient } from 'components/apiClient';
import { Transaction } from '../../lib/entity/Transaction';
import { createAppAsyncThunk, RootState } from '../typedStore';

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

export const fetchTransactions = createAppAsyncThunk<Transaction[], string | null>(
    'transaction/fetch',
    async (gid, thunkAPI) => {
        const backendUrl = thunkAPI.getState().global.backendUrl
        return await apiClient.fetchTransactions(gid, backendUrl)
    },
    {
        condition: (gid, thunkAPI) => !thunkAPI.getState().transaction.loading && !!gid
    }
)

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
    extraReducers: (builder) => {
        builder.addCase(fetchTransactions.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchTransactions.fulfilled, (state, action) => {
            state.loading = false
            state.transcations = action.payload
        })
        builder.addCase(fetchTransactions.rejected, (state, action) => {
            state.loading = false
            console.log(`Fetch transactions rejected: ${JSON.stringify(action.error)}`)
        })
    }
})

export const transactionListSelector = (state: RootState) => state.transaction.transcations
export const { createNewTransactionSuccess } = transactionSlice.actions
export default transactionSlice.reducer
