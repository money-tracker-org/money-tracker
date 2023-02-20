import { useEffect } from 'react'
import { User } from '../../lib/entity/User'
import { useAppDispatch, useAppSelector } from '../../pages/store'
import styles from './UserList.module.css'
import { fetchUsersIfNotFound, userListSelector } from './userSlice'

const renderUserCard = (user: User) => {
    return (
        <article className={styles.usercard}>
            <kbd>#{user.id}</kbd>{' '}
            <span>
                {user.firstName} {user.lastName}
            </span>
        </article>
    )
}

export const UserList = () => {
    const users = useAppSelector(userListSelector)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchUsersIfNotFound())
    }, [])
    return <div>{users.map((u) => renderUserCard(u))}</div>
}
