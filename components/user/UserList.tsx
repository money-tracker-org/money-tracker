import { User } from '../../lib/entity/User'
import { useCurrentGroup } from '../group/CurrentGroup'
import styles from './UserList.module.css'

const renderUserCard = (user: User) => {
    return (
        <article className={styles.usercard}>
            <kbd>#{user.id}</kbd> <span>{user.displayName}</span>
        </article>
    )
}

export const UserList = () => {
    const group = useCurrentGroup()
    return <div>{group?.users.map((u) => renderUserCard(u))}</div>
}
