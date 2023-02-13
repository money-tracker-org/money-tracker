import { useEffect, useState } from 'react';
import { Payment } from '../../lib/entity/Payment';
import { useAppDispatch, useAppSelector } from '../../pages/store';
import { fetchUsersIfNotFound, userListSelector } from '../user/userSlice';
import { PaymentCardPayInput } from './PaymentCardPayInput';
import { PaymentSumDiscrepancyCard } from './PaymentSumDiscrepancyCard';
import { createNewTransaction, transactionFormEqualSplitAmountChange, transactionFormFieldChange, transactionFormItemSelector, transactionFormUnequalAmountChange, transactionFormUnequalPaymentChange } from './transactionFormSlice';


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
        const displayTotalAmount = !!newTotalAmountString ? parseFloat(newTotalAmountString) : ""
        setTotalAmount(displayTotalAmount)
        const valueTotalAmount = !!newTotalAmountString ? parseFloat(newTotalAmountString) : 0
        if (useEqualSplit) {
            dispatch(transactionFormEqualSplitAmountChange({ totalAmount: valueTotalAmount, users }))
        } else {
            dispatch(transactionFormUnequalAmountChange({ totalAmount: valueTotalAmount, users }))
        }
    }

    useEffect(() => {
        totalAmountChanged(totalAmount.toString())
    }, [useEqualSplit])

    const onFormSubmit = () => {
        const newFieldsValid = {
            title: !!transactionFormContent.formTransaction.title,
            date: !!transactionFormContent.formTransaction.date,
            amount: !!totalAmount,
        }
        let formValid = true;
        Object.entries(newFieldsValid).forEach(([property, value]) => { formValid = formValid && value })
        setFieldsValid(newFieldsValid)
        if (formValid) {
            dispatch(createNewTransaction(transactionFormContent.formTransaction))
        }
    }

    const onPayInputEdit = (payment: Payment, value: string) => {
        const newValue = Number.isNaN(parseFloat(value)) ? 0 : parseFloat(value)
        const totalAmountValue = Number.isNaN(parseFloat(totalAmount.toString())) ? 0 : parseFloat(totalAmount.toString())
        dispatch(transactionFormUnequalPaymentChange({ payment: payment, newPaymentValue: newValue, users: users, totalAmount: totalAmountValue }));
    }
    const currentPaymentSum = transactionFormContent.formTransaction.payments?.map(p => p.amountInEur).reduce((a, b) => a + b, 0)
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
                    <span>
                        <input
                            type="checkbox"
                            id="useEqualPaySwitch"
                            name="useEqualPaySwitch"
                            role="switch"
                            checked={useEqualSplit}
                            onChange={_ => setUseEqualSplit(!useEqualSplit)}
                        />
                        Split equally
                    </span>
                    {!useEqualSplit && <PaymentSumDiscrepancyCard totalAmount={totalAmount} transactionPaymentSum={currentPaymentSum} />}
                </label>
            </fieldset>
            <div>
                {!!transactionFormContent.formTransaction.payments
                    && transactionFormContent.formTransaction.payments.map(p => (
                        <PaymentCardPayInput payment={p} equalSplit={useEqualSplit} onValueChange={(v) => onPayInputEdit(p, v)} />
                    ))}
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