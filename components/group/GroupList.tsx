import { useAppDispatch, useAppSelector } from 'components/typedStore'
import { Group } from 'lib/entity/Group'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { AddNewGroupCard, GroupCard } from './GroupCard'
import { fetchGroups, groupListSelector } from './groupSlice'

export const GroupList = () => {
    const groups = useAppSelector(groupListSelector)
    const dispatch = useAppDispatch()
    const router = useRouter()
    useEffect(() => {
        dispatch(fetchGroups())
    }, [])
    const onGroupSelected = (g: Group) => {
        router.push(`/${g.gid}/transaction`)
    }

    const onGroupEdit = (g: Group) => {
        router.push(`/${g.gid}/user`)
    }

    const onNewGroup = () => {
        router.push(`/group`)
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
            <AddNewGroupCard onAddNewGroupClick={onNewGroup} />
        </div>
    )
}
