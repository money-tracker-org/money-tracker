import { Group } from 'lib/entity/Group'
import { Pencil, PlusCircle } from 'react-bootstrap-icons'
import styles from './GroupCard.module.css'

interface GroupCardProps {
    group: Group
    onGroupClick: () => void
    onGroupEditClick: () => void
}

export const GroupCard = ({ group, onGroupClick, onGroupEditClick }: GroupCardProps) => {
    return (
        <article className={styles.groupCardContainer}>
            <a onClick={onGroupClick} className={styles.groupCardBody}>
                <hgroup>
                    <h2>{group.name}</h2>
                    <h3>{group.users.length} users</h3>
                </hgroup>
            </a>
            <button
                className={styles.editGroupButton}
                onClick={onGroupEditClick}
            ><Pencil /></button>
        </article >
    )
}

interface AddNewGroupCardProps {
    onAddNewGroupClick: () => void
}

export const AddNewGroupCard = ({ onAddNewGroupClick }: AddNewGroupCardProps) => {
    return (
        <article className={styles.groupCardContainer}>
            <button className="outline" onClick={onAddNewGroupClick}>
                <PlusCircle className={styles.newGroupButtonIcon} />
                <span className={styles.newGroupButtonText}>New Group</span>
            </button>
        </article >
    )
}
