import { useRouter } from 'next/router';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useAppDispatch } from '../../pages/store';
import { useCurrentGroup } from '../group/CurrentGroup';
import { setCurrentGroupId } from '../group/groupSlice';
import styles from "./SelectedGroupNav.module.css";



export const SelectedGroupNav = () => {
    const currentGroup = useCurrentGroup()
    const dispatch = useAppDispatch()
    const router = useRouter()

    const onGroupDeselected = () => {
        dispatch(setCurrentGroupId(null))
        goToGroups()
    }

    const goToGroups = () => {
        router.push("/")
    }

    if (currentGroup === null) {
        return (
            <strong onClick={goToGroups} className={styles.navTitle}>money-tracker</strong>
        )
    } else {
        return (
            <strong onClick={onGroupDeselected} className={styles.navTitle}>
                <ArrowLeft /> {currentGroup?.name}
            </strong>
        )
    }
}