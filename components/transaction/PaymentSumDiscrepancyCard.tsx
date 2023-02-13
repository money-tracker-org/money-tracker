import styles from "./PaymentSumDiscrepancyCard.module.css"

export interface PaymentSumDiscrepancyCardProps {
    totalAmount: number | string
    transactionPaymentSum: number | undefined
}

export const PaymentSumDiscrepancyCard = ({ totalAmount, transactionPaymentSum }: PaymentSumDiscrepancyCardProps) => {
    const totalAmountValue = typeof totalAmount === "string" ? 0 : totalAmount
    const totalAmountString = totalAmountValue.toFixed(2)
    const paymentSum = typeof transactionPaymentSum === "number" ? transactionPaymentSum : 0
    const paymentSumString = paymentSum.toFixed(2)
    const balanced = totalAmountString === paymentSumString
    const difference = paymentSum - totalAmountValue
    const sign = Math.abs(difference) < 0.01 ? "=" : difference < 0 ? "<" : ">"
    const balanceCssClass = balanced ? styles.balanced : styles.unbalanced
    return (
        <span className={`${balanceCssClass} ${styles.card}`}>
            Payment sum {paymentSumString} {sign} total {totalAmountString}
        </span>
    )
}