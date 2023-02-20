import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { evaluateArithmeticExpressionSafe } from '../../lib/arithmetic/arithmetic'
import { Payment } from '../../lib/entity/Payment'
import { Transaction } from '../../lib/entity/Transaction'
import { User } from '../../lib/entity/User'
import { AppDispatch, AppGetState, RootState } from '../../pages/store'
import * as transactionSlice from './transactionSlice'

export type TransactionFormPayment = Payment &
    Partial<Payment> & {
        editedManually?: boolean
        rawPaymentInput?: string
    }

export interface TransactionFormTransaction extends Partial<Transaction> {
    payments?: TransactionFormPayment[]
}

export type TransactionFormState = {
    formTransaction: TransactionFormTransaction
    loading: boolean
    error?: Error
}

const initialState: TransactionFormState = {
    formTransaction: {
        title: '',
        date: new Date().toISOString().split('T')[0],
        payments: undefined,
    },
    loading: false,
}

export interface AmountChange {
    totalAmount: number
    users: User[]
}

export interface UnequalPaymentChange {
    totalAmount: number
    users: User[]
    payment: Payment
    newPayment: string
}

const makeDefaultPaymentsForUsers = (totalAmount: number, users: User[]) => {
    const onePart = totalAmount / users.length
    return users.map((u, idx) => ({
        amountInEur: onePart,
        user: u,
        id: idx,
        rawPaymentInput: onePart.toString(),
    })) as TransactionFormPayment[]
}

export const transactionFormSlice = createSlice({
    name: 'transactionForm',
    initialState,
    reducers: {
        transactionFormFieldChange: (
            state,
            action: PayloadAction<Partial<Transaction>>
        ) => {
            Object.assign(state.formTransaction, action.payload)
        },
        transactionFormEqualSplitAmountChange: (
            state,
            action: PayloadAction<AmountChange>
        ) => {
            const payments: Payment[] = makeDefaultPaymentsForUsers(
                action.payload.totalAmount,
                action.payload.users
            )
            state.formTransaction.payments = payments
        },
        transactionFormUnequalAmountChange: (
            state,
            action: PayloadAction<AmountChange>
        ) => {
            const onePart =
                action.payload.totalAmount / action.payload.users.length
            if (
                state.formTransaction.payments === undefined ||
                state.formTransaction.payments?.length === 0
            ) {
                state.formTransaction.payments = makeDefaultPaymentsForUsers(
                    action.payload.totalAmount,
                    action.payload.users
                )
            }
            const payments: TransactionFormPayment[] =
                state.formTransaction.payments
            for (var p of payments) {
                if (!p.editedManually) {
                    p.amountInEur = onePart
                    p.rawPaymentInput = onePart.toString()
                }
            }
            state.formTransaction.payments = payments
        },
        transactionFormUnequalPaymentChange: (
            state,
            action: PayloadAction<UnequalPaymentChange>
        ) => {
            if (state.formTransaction.payments === undefined) {
                state.formTransaction.payments = makeDefaultPaymentsForUsers(
                    action.payload.totalAmount,
                    action.payload.users
                )
            }

            const newPaymentValue = evaluateArithmeticExpressionSafe(
                action.payload.newPayment
            )
            if (newPaymentValue === undefined) {
                // if the expression in the payment field is invalid, we want to set the rawPaymentInput but not anything else..
                state.formTransaction.payments =
                    state.formTransaction.payments.map((p) => {
                        if (p.id === action.payload.payment.id) {
                            p.rawPaymentInput = action.payload.newPayment
                        }
                        return p
                    })
                return
            }
            // get the sum of manually set fields (we want to rebalance the unset fields)
            const manuallySetSum =
                state.formTransaction.payments
                    .filter((p) => !!p.editedManually)
                    .filter((p) => p.id !== action.payload.payment.id)
                    .map((p) => p.amountInEur)
                    .reduce((a, b) => a + b, 0) + newPaymentValue

            const notManuallySetPaymentCount = state.formTransaction.payments
                .filter((p) => !p.editedManually)
                .filter((p) => p.id !== action.payload.payment.id).length

            const onePart =
                (action.payload.totalAmount - manuallySetSum) /
                notManuallySetPaymentCount

            const payments: TransactionFormPayment[] =
                state.formTransaction.payments.map((p) => {
                    if (p.id === action.payload.payment.id) {
                        p.amountInEur = newPaymentValue
                        p.rawPaymentInput = action.payload.newPayment
                        p.editedManually = true
                    } else if (!p.editedManually) {
                        p.amountInEur = Math.max(0, onePart)
                        p.rawPaymentInput = Math.max(0, onePart).toString()
                    }
                    return p
                })
            state.formTransaction.payments = payments
        },
        createNewTransactionStarted: (state) => {
            state.loading = true
        },
        createNewTransactionError: (state, action: PayloadAction<Error>) => {
            state.error = action.payload
        },
        createNewTransactionSuccess: (
            state,
            action: PayloadAction<Transaction>
        ) => {
            state.formTransaction = initialState.formTransaction
        },
    },
})

export const createNewTransaction =
    (transaction: Partial<Transaction>) =>
    async (dispatch: AppDispatch, getState: AppGetState) => {
        dispatch(transactionFormSlice.actions.createNewTransactionStarted())
        try {
            const response = await fetch(
                `${getState().global.backendUrl}/api/transaction`,
                {
                    body: JSON.stringify(transaction),
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            const createdTransaction = await response.json()
            dispatch(
                transactionSlice.createNewTransactionSuccess(createdTransaction)
            )
            dispatch(
                transactionFormSlice.actions.createNewTransactionSuccess(
                    createdTransaction
                )
            )
        } catch (e) {
            dispatch(
                transactionFormSlice.actions.createNewTransactionError(
                    e as Error
                )
            )
        }
    }

export const transactionFormItemSelector = (state: RootState) =>
    state.transactionForm

export const {
    transactionFormFieldChange,
    transactionFormEqualSplitAmountChange,
    transactionFormUnequalAmountChange,
    transactionFormUnequalPaymentChange,
} = transactionFormSlice.actions

export default transactionFormSlice.reducer
