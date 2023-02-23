import { User } from 'lib/entity/User'
import { DashCircle, PlusCircle } from 'react-bootstrap-icons'
import styles from './GroupFormUserInput.module.css'

interface GroupFormUserInputProps {
    users: Partial<User>[]
    onUsersChange: (newUsers: Partial<User>[]) => void
}

export const GroupFormUserInput = ({
    users,
    onUsersChange,
}: GroupFormUserInputProps) => {
    const addNewEmptyUserInput = () => {
        onUsersChange([...users, { displayName: '' }])
    }
    const changeUser = (idx: number, newUser: User) => {
        const changedUsers = users.map((u, i) => (i == idx ? newUser : u))
        onUsersChange(changedUsers)
    }
    const removeUser = (idx: number) => {
        const changedUsers = users
            .map((u, i) => (i == idx ? undefined : u))
            .filter((u) => u !== undefined) as User[]
        onUsersChange(changedUsers)
    }
    return (
        <div>
            {users.map((u, idx) => (
                <SingleUserInput
                    key={idx}
                    user={u}
                    onChange={(newUser) => changeUser(idx, newUser as User)}
                    onRemove={() => removeUser(idx)}
                    removable={idx !== 0}
                />
            ))}
            <button type="button" onClick={addNewEmptyUserInput}>
                Add User <PlusCircle />
            </button>
        </div>
    )
}

interface SingleUserNameInputProps {
    user: Partial<User>
    removable: boolean
    onRemove: () => void
    onChange: (newUser: Partial<User>) => void
    key: string | number
}

const SingleUserInput = ({
    user,
    removable,
    onRemove,
    onChange,
}: SingleUserNameInputProps) => {
    const renderRemoveButton = () => {
        if (!removable) {
            return null
        }
        return (
            <button
                type="button"
                className={styles.userRemoveButton}
                onClick={onRemove}
            >
                <DashCircle />
            </button>
        )
    }
    return (
        <div className={styles.userContainer}>
            <input
                type="text"
                className={styles.userNameInput}
                autoComplete="off"
                autoCorrect="off"
                placeholder="User name"
                value={user.displayName}
                onChange={(e) =>
                    onChange({ ...user, displayName: e.target.value })
                }
                required
            />
            {renderRemoveButton()}
        </div>
    )
}
