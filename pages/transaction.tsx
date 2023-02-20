import { NewTransactionForm } from '../components/transaction/NewTransactionForm'
import { TransactionList } from '../components/transaction/TransactionList'
export default function TransactionPage() {
    return (
        <main className="container">
            <NewTransactionForm />
            <div>Existing transactions:</div>
            <TransactionList />
        </main>
    )
}
