import { useAppDispatch, useAppSelector } from 'components/typedStore'
import { Group } from 'lib/entity/Group'
import { User } from 'lib/entity/User'
import { FormEventHandler, useState } from 'react'
import { GroupFormUserInput } from './GroupFormUserInput'
import { createNewGroup } from './groupSlice'

export type GroupFormUser = Partial<User> | { valid?: boolean }

export type GroupFormGroup = Partial<Group> & { users: GroupFormUser[] }

export const GroupForm = () => {
    const loading = useAppSelector((state) => state.group.loading)
    const dispatch = useAppDispatch()
    const [formInfo, setFormInfo] = useState<GroupFormGroup>({
        name: '',
        users: [{ displayName: '' } as User],
    })

    const submitGroup: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        console.log("Creating new group!")
        if (formInfo.name) {
            dispatch(createNewGroup(formInfo))
        }
    }

    return (
        <form onSubmit={submitGroup}>
            <div>
                <input
                    type="text"
                    name="name"
                    disabled={loading}
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="Group name"
                    value={formInfo.name}
                    onChange={(e) =>
                        setFormInfo({ ...formInfo, name: e.target.value })
                    }
                    required
                />
            </div>
            <div>
                <GroupFormUserInput
                    users={formInfo.users || []}
                    loading={loading}
                    onUsersChange={(u) =>
                        setFormInfo({ ...formInfo, users: u as User[] })
                    }
                />
            </div>
            <div>
                <button
                    type="submit"
                    aria-busy={loading ? 'true' : 'false'}
                >
                    Create New Group
                </button>
            </div>
        </form>
    )
}
