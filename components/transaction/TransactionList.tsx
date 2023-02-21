import { useEffect } from 'react';
import { Transaction } from '../../lib/entity/Transaction';
import { useAppDispatch, useAppSelector } from '../../pages/store';
import { useCurrentGroup } from '../group/CurrentGroup';
import { fetchTransactions, transactionListSelector } from './transactionSlice';

const renderTransactionCard = (transaction: Transaction) => {
    let transactionSum = 0
    transaction.payments.forEach((p) => (transactionSum += p.amountInEur))
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
    const group = useCurrentGroup()
    useEffect(() => {
        dispatch(fetchTransactions(group))
    }, [group])
    return <div>{transactions.map((t) => renderTransactionCard(t))}</div>
}
