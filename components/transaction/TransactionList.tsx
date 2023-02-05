import { useEffect } from 'react';
import { Transaction } from '../../lib/entity/Transaction';
import { useAppDispatch, useAppSelector } from '../../pages/store';
import { fetchTransactions, transactionListSelector } from './transactionSlice';

const renderTransactionCard = (transaction: Transaction) => {
    let transactionSum = 0
    transaction.payments.forEach(p => transactionSum += p.amountInEur)
    return (
        <article>
            <strong>{transaction.title}</strong>
            <span>: {transactionSum.toFixed(2)}</span>
        </article>
    )
}

export const TransactionList = () => {
    const transactions = useAppSelector(transactionListSelector)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchTransactions())
    }, []);
    return (
        <div>
            {transactions.map(t => renderTransactionCard(t))}
        </div>
    )
}