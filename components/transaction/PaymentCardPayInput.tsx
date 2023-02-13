import { useState } from 'react';
import { Payment } from "../../lib/entity/Payment";
import styles from './PaymentCardPayInput.module.css';

interface PaymentCardPayInputProps {
    payment: Payment
    equalSplit: boolean
    onValueChange: (val: string) => void
}

export const PaymentCardPayInput = ({ payment, equalSplit, onValueChange }: PaymentCardPayInputProps) => {
    const fixedPrecisionAmount = payment.amountInEur.toFixed(2)
    const exactAmount = payment.amountInEur.toString(10)
    // at max 2 point precision
    const displayValue = fixedPrecisionAmount.length <= exactAmount.length ? fixedPrecisionAmount : exactAmount


    const [editedManually, setEditedManually] = useState(false)
    if (editedManually && equalSplit) {
        setEditedManually(false)
    }


    return (
        <article className={styles.usercard}>
            <kbd>{payment.user.firstName} {payment.user.lastName}</kbd>
            <span>
                <input
                    className={styles.paymentCardAmountInput}
                    type="number"
                    placeholder="€"
                    name="amount"
                    disabled={equalSplit}
                    value={displayValue}
                    onChange={e => onValueChange(e.target.value)}
                />
            </span>
        </article>
    )
}