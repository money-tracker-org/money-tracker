import { useAppDispatch, useAppSelector } from 'components/store'
import { Group } from 'lib/entity/Group'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { GroupCard } from './GroupCard'
import { fetchGroupsIfNotFound, groupListSelector, setCurrentGroupId } from './groupSlice'

export const GroupList = () => {
    const groups = useAppSelector(groupListSelector)
    const dispatch = useAppDispatch()
    const router = useRouter()
    useEffect(() => {
        dispatch(fetchGroupsIfNotFound())
    }, [])
    const onGroupSelected = (g: Group) => {
        dispatch(setCurrentGroupId(g.gid))
        router.push(`/${g.gid}/transaction`)
    }

    const onGroupEdit = (g: Group) => {
        dispatch(setCurrentGroupId(g.gid))
        router.push(`/${g.gid}/user`)
    }
    return (
        <div>
            {groups.map((g: Group, idx: number) => (
                <GroupCard
                    key={idx}
                    group={g}
                    onGroupClick={() => onGroupSelected(g)}
                    onGroupEditClick={() => onGroupEdit(g)}
                />
            ))}
        </div>
    )
}
