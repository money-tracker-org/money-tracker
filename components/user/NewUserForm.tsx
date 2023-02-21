import { useState } from 'react';
import { User } from '../../lib/entity/User';
import { useAppDispatch, useAppSelector } from '../../pages/store';
import { useCurrentGroup } from '../group/CurrentGroup';
import { createNewUser } from '../group/groupSlice';

export default function CreateNewUser() {
    const loading = useAppSelector((state) => state.group.loading)
    const dispatch = useAppDispatch()
    const group = useCurrentGroup()
    const [inputForm, setFormInfo] = useState<Partial<User>>({
        displayName: '',
    })
    const handleKeyPress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormInfo({ ...inputForm, [e.target.name]: e.target.value })
    }
    const [fieldsValid, setFieldsValid] = useState({
        displayName: true,
    })
    const submitUser = () => {
        const validationResult = {
            displayName: inputForm.displayName !== '',
        }
        setFieldsValid(validationResult)
        if (validationResult.displayName) {
            dispatch(createNewUser(inputForm, group))
        }
        setFormInfo({ displayName: '' })
    }

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div>
                <input
                    type="text"
                    name="displayName"
                    disabled={loading}
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="Name"
                    value={inputForm.displayName}
                    onChange={handleKeyPress}
                    aria-invalid={
                        fieldsValid.displayName === true ? undefined : true
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
