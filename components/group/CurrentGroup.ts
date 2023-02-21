import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../pages/store';
import { fetchGroupsIfNotFound, groupListSelector } from './groupSlice';


export const useCurrentGroup = () => {
    const dispatch = useAppDispatch()
    const allGroups = useAppSelector(groupListSelector)
    const router = useRouter()
    const groupIdFromRouter = router.query.groupId
    useEffect(() => {
        dispatch(fetchGroupsIfNotFound())
    }, [])
    if (groupIdFromRouter === undefined) {
        return null
    }
    const selectedGroup = allGroups.find(g => g.gid === groupIdFromRouter)
    if (!selectedGroup) {
        return null
    }
    return selectedGroup
}