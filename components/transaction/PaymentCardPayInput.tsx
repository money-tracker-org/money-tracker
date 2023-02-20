import { useState } from 'react'
import styles from './PaymentCardPayInput.module.css'
import { TransactionFormPayment } from './transactionFormSlice'

interface PaymentCardPayInputProps {
    payment: TransactionFormPayment
    equalSplit: boolean
    onValueChange: (val: string) => void
}

export const PaymentCardPayInput = ({
    payment,
    equalSplit,
    onValueChange,
}: PaymentCardPayInputProps) => {
    const [editedManually, setEditedManually] = useState(false)
    if (editedManually && equalSplit) {
        setEditedManually(false)
    }

    return (
        <article className={styles.usercard}>
            <kbd>
                {payment.user.firstName} {payment.user.lastName}
            </kbd>
            <span>
                <input
                    className={styles.paymentCardAmountInput}
                    type="text"
                    placeholder="€"
                    name="amount"
                    disabled={equalSplit}
                    value={payment.rawPaymentInput}
                    onChange={(e) => onValueChange(e.target.value)}
                />
            </span>
        </article>
    )
}
