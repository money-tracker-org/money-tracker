import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../pages/store';
import { fetchUsersIfNotFound, userListSelector } from '../user/userSlice';
import { PaymentCardPayInput } from './PaymentCardPayInput';
import { createNewTransaction, transactionFormEqualPaymentChange, transactionFormFieldChange, transactionFormItemSelector } from './transactionFormSlice';


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
        dispatch(transactionFormEqualPaymentChange({ totalAmount: valueTotalAmount, users }))
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
        Object.entries(newFieldsValid).forEach(([property, value]) => { formValid = formValid && value })
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
                {!!transactionFormContent.formTransaction.payments
                    && transactionFormContent.formTransaction.payments.map(p => (
                        <PaymentCardPayInput payment={p} equalSplit={useEqualSplit} onValueChange={() => false} />
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