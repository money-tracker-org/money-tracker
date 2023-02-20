import { useState } from 'react'
import { User } from '../../lib/entity/User'
import { useAppDispatch, useAppSelector } from '../../pages/store'
import { createNewUser } from './userSlice'

export default function CreateNewUser() {
    const loading = useAppSelector((state) => state.user.loading)
    const dispatch = useAppDispatch()
    const [inputForm, setFormInfo] = useState<Partial<User>>({
        firstName: '',
        lastName: '',
    })
    const handleKeyPress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormInfo({ ...inputForm, [e.target.name]: e.target.value })
    }
    const [fieldsValid, setFieldsValid] = useState({
        firstName: true,
        lastName: true,
    })
    const submitUser = () => {
        const validationResult = {
            firstName: inputForm.firstName !== '',
            lastName: inputForm.lastName !== '',
        }
        setFieldsValid(validationResult)
        if (validationResult.firstName && validationResult.lastName) {
            dispatch(createNewUser(inputForm))
        }
        setFormInfo({ firstName: '', lastName: '' })
    }

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div>
                <input
                    type="text"
                    name="firstName"
                    disabled={loading}
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="First name"
                    value={inputForm.firstName}
                    onChange={handleKeyPress}
                    aria-invalid={
                        fieldsValid.firstName === true ? undefined : true
                    }
                    required
                />
            </div>
            <div>
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    autoComplete="off"
                    autoCorrect="off"
                    disabled={loading}
                    value={inputForm.lastName}
                    onChange={handleKeyPress}
                    aria-invalid={
                        fieldsValid.lastName === true ? undefined : true
                    }
                    required
                />
            </div>
            <div>
                <button
                    type="submit"
                    onClick={submitUser}
                    aria-busy={loading ? 'true' : 'false'}
                >
                    Create New User{' '}
                </button>
            </div>
        </form>
    )
}
