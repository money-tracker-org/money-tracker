import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../typedStore';
import { fetchGroups, groupListSelector } from './groupSlice';


export const useCurrentGroup = () => {
    const dispatch = useAppDispatch()
    const allGroups = useAppSelector(groupListSelector)
    const router = useRouter()
    const groupIdFromRouter = router.query.groupId as string
    useEffect(() => {
        dispatch(fetchGroups())
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