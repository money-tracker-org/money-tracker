import { Group } from 'lib/entity/Group'
import { User } from 'lib/entity/User'
import { useAppDispatch, useAppSelector } from 'pages/store'
import { useState } from 'react'
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

    const submitGroup = () => {
        if (!!formInfo.name) {
            dispatch(createNewGroup(formInfo))
        }
    }

    return (
        <form onSubmit={(e) => e.preventDefault()}>
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
                    onUsersChange={(u) =>
                        setFormInfo({ ...formInfo, users: u as User[] })
                    }
                />
            </div>
            <div>
                <button
                    type="submit"
                    onClick={submitGroup}
                    aria-busy={loading ? 'true' : 'false'}
                >
                    Create New Group{' '}
                </button>
            </div>
        </form>
    )
}
