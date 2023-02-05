import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Payment } from '../../lib/entity/Payment';
import { Transaction } from '../../lib/entity/Transaction';
import { User } from '../../lib/entity/User';
import { AppDispatch, AppGetState, RootState } from '../../pages/store';
import * as transactionSlice from './transactionSlice';

export type TransactionFormState = {
    formTransaction: Partial<Transaction>
    loading: boolean
    error?: Error
}

const initialState: TransactionFormState = {
    formTransaction: {
        title: "",
        date: new Date().toISOString().split('T')[0],
        payments: undefined
    },
    loading: false,
}

export interface EqualPaymentChange {
    totalAmount: number,
    users: User[]
}

export const transactionFormSlice = createSlice({
    name: 'transactionForm',
    initialState,
    reducers: {
        transactionFormFieldChange: (state, action: PayloadAction<Partial<Transaction>>) => {
            Object.assign(state.formTransaction, action.payload)
        },
        transactionFormEqualPaymentChange: (state, action: PayloadAction<EqualPaymentChange>) => {
            const onePart = action.payload.totalAmount / action.payload.users.length
            const payments: Payment[] = action.payload.users.map(u => ({
                amountInEur: onePart,
                user: u
            })) as Payment[]
            state.formTransaction.payments = payments
        },
        createNewTransactionStarted: (state) => {
            state.loading = true
        },
        createNewTransactionError: (state, action: PayloadAction<Error>) => {
            state.error = action.payload
        },
        createNewTransactionSuccess: (state, action: PayloadAction<Transaction>) => {
            state.formTransaction = initialState.formTransaction
        },
    },
})

export const createNewTransaction = (transaction: Partial<Transaction>) => async (dispatch: AppDispatch, getState: AppGetState) => {
    dispatch(transactionFormSlice.actions.createNewTransactionStarted())
    try {
        const response = await fetch(`${getState().global.backendUrl}/api/transaction`, {
            body: JSON.stringify(transaction),
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
        const createdTransaction = await response.json()
        dispatch(transactionSlice.createNewTransactionSuccess(createdTransaction))
        dispatch(transactionFormSlice.actions.createNewTransactionSuccess(createdTransaction))
    } catch (e) {
        dispatch(transactionFormSlice.actions.createNewTransactionError(e as Error))
    }
}

export const transactionFormItemSelector = (state: RootState) => state.transactionForm

export const { transactionFormFieldChange, transactionFormEqualPaymentChange } = transactionFormSlice.actions

export default transactionFormSlice.reducer