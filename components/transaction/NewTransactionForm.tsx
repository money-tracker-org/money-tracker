import { useEffect, useState } from 'react';
import { Payment } from '../../lib/entity/Payment';
import { useAppDispatch, useAppSelector } from '../../pages/store';
import { fetchUsersIfNotFound, userListSelector } from '../user/userSlice';
import styles from './NewTransactionForm.module.css';
import { createNewTransaction, transactionFormEqualPaymentChange, transactionFormFieldChange, transactionFormItemSelector } from './transactionFormSlice';



const renderPaymentCardPay = (payment: Payment, equalSplit: boolean, onValueChange: (val: string) => void) => {
    const displayValue = payment.amountInEur.toFixed(2).length <= payment.amountInEur.toString(10).length ? payment.amountInEur.toFixed(2) : payment.amountInEur.toString(10)
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

export const NewTransactionForm = () => {
    const dispatch = useAppDispatch()
    const usersLoading = useAppSelector(state => state.user.loading)
    const users = useAppSelector(userListSelector)
    useEffect(() => {
        dispatch(fetchUsersIfNotFound())
    }, []);
    const [fieldsValid, setFieldsValid] = useState({
        title: true,
        date: true,
        amount: true,
    })
    const [totalAmount, setTotalAmount] = useState<number | string>("")
    const [useEqualSplit, setUseEqualSplit] = useState(true)
    const transactionFormContent = useAppSelector(transactionFormItemSelector)

    const handleSimpleKeyPress = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(transactionFormFieldChange({ [e.target.name]: e.target.value }));
    };

    const totalAmountChanged = (newTotalAmountString: string) => {
        // TODO maybe limit the precision
        const newTotalAmount = newTotalAmountString === "" ? 0 : parseFloat(newTotalAmountString)
        if (newTotalAmountString === "") {
            setTotalAmount(newTotalAmountString)
        } else {
            setTotalAmount(newTotalAmount)
        }
        dispatch(transactionFormEqualPaymentChange({ totalAmount: newTotalAmount, users }))
    }

    useEffect(() => {
        if (users.length > 0 && transactionFormContent.formTransaction.payments === undefined) {
            const initialTotalAmount = typeof totalAmount === "string" ? 0 : totalAmount
            dispatch(transactionFormEqualPaymentChange({ totalAmount: initialTotalAmount, users }))
        }
    }, [users, transactionFormContent.formTransaction.payments])

    const onFormSubmit = () => {
        const newFieldsValid = {
            title: !!transactionFormContent.formTransaction.title,
            date: !!transactionFormContent.formTransaction.date,
            amount: !!totalAmount,
        }
        let formValid = true;
        Object.entries(newFieldsValid).forEach((e) => { formValid = formValid && e[1] })
        setFieldsValid(newFieldsValid)
        if (formValid) {
            dispatch(createNewTransaction(transactionFormContent.formTransaction))
        }
    }

    return (
        <form onSubmit={e => e.preventDefault()}>
            <div>
                <input
                    type="text"
                    name="title"
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="Title"
                    value={transactionFormContent.formTransaction.title}
                    onChange={handleSimpleKeyPress}
                    aria-invalid={fieldsValid.title === true ? undefined : true}
                    required
                />
            </div>
            <div className="grid">
                <input
                    type="date"
                    name="date"
                    aria-label="date"
                    value={transactionFormContent.formTransaction.date}
                    onChange={handleSimpleKeyPress}
                    aria-invalid={fieldsValid.date === true ? undefined : true}
                    required
                />
                <input
                    type="number"
                    placeholder="Amount €"
                    name="amount"
                    value={totalAmount}
                    onChange={e => totalAmountChanged(e.target.value)}
                    aria-invalid={fieldsValid.amount === true ? undefined : true}
                    required
                />
            </div>
            <fieldset>
                <label htmlFor="useEqualPaySwitch">
                    <input
                        type="checkbox"
                        id="useEqualPaySwitch"
                        name="useEqualPaySwitch"
                        role="switch"
                        checked={useEqualSplit}
                        onChange={_ => setUseEqualSplit(!useEqualSplit)}
                    />
                    Split equally
                </label>
            </fieldset>
            <div>
                {!!transactionFormContent.formTransaction.payments && transactionFormContent.formTransaction.payments.map(p => renderPaymentCardPay(p, useEqualSplit, (e) => { }))}
            </div>
            <div>
                <button
                    type="submit"
                    onClick={onFormSubmit}
                >Create Transaction </button>
            </div>
        </form>
    );
}