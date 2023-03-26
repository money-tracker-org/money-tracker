import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from 'components/apiClient';
import { createAppAsyncThunk, RootState, useAppDispatch, useAppSelector } from 'components/typedStore';
import { Group } from 'lib/entity/Group';
import { User } from 'lib/entity/User';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { RegisteredGroup } from '../../lib/dto/GroupCollection';
import { getLocalStorageRegisteredGroups, setLocalStorageRegisteredGroups } from './groupStorage';

export interface GroupState {
    groups: Group[]
    registeredGroups: RegisteredGroup[]
    loading: boolean
    error?: Error
}

const initialState: GroupState = {
    groups: [],
    registeredGroups: getLocalStorageRegisteredGroups(),
    loading: false,
    error: undefined,
}

export const fetchGroups = createAppAsyncThunk(
    'group/fetch',
    async (_, thunkAPI) => {
        const backendUrl = thunkAPI.getState().global.backendUrl
        return await apiClient.fetchGroups(backendUrl)
    },
    {
        condition: (_, thunkAPI) => {
            const groupState = thunkAPI.getState().group
            if (
                !!groupState.error ||
                groupState.loading ||
                groupState.groups.length > 0
            ) {
                return false
            }
            return true;
        }
    }
)

export const fetchRegisteredGroups = createAppAsyncThunk(
    'group/fetchRegistered',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState()
        const backendUrl = state.global.backendUrl
        const registeredGroups = state.group.registeredGroups
        return await apiClient.fetchGroupsCollection(registeredGroups, backendUrl)
    },
    {
        condition: (_, thunkAPI) => {
            const groupState = thunkAPI.getState().group
            if (
                !!groupState.error ||
                groupState.loading
            ) {
                return false
            }
            return true;
        }
    }
)

export const createNewUser = createAppAsyncThunk<User, {
    user: Partial<User>,
    gid: string | null
}>(
    'group/newUser',
    async ({ user, gid }, thunkAPI) => {
        const backendUrl = thunkAPI.getState().global.backendUrl
        return await apiClient.createNewUser(user, gid, backendUrl)
    },
    {
        condition: (arg, thunkAPI) => !thunkAPI.getState().group.loading && arg.gid !== null
    }
)

export const createNewGroup = createAppAsyncThunk<Group, Partial<Group>>(
    'group/newGroup',
    async (group, thunkAPI) => {
        const state = thunkAPI.getState()
        const backendUrl = state.global.backendUrl
        const createdGroup = await apiClient.createNewGroup(group, backendUrl)

        const currentRegisteredGroups = state.group.registeredGroups
        const newRegisteredGroup = { groupId: createdGroup.gid, asUserId: null }
        thunkAPI.dispatch(groupSlice.actions.registerNewGroups([...currentRegisteredGroups, newRegisteredGroup]))

        return createdGroup
    },
    {
        condition: (_, thunkAPI) => !thunkAPI.getState().group.loading
    }
)

export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        registerNewGroups: (state, action: PayloadAction<RegisteredGroup[]>) => {
            if (state.registeredGroups != action.payload) {
                setLocalStorageRegisteredGroups(action.payload)
                state.registeredGroups = action.payload
            }
        }
    },
    extraReducers: (builder) => {
        // fetchGroups
        builder.addCase(fetchGroups.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchGroups.fulfilled, (state, action) => {
            state.loading = false
            state.groups = action.payload
        })
        builder.addCase(fetchGroups.rejected, (state, action) => {
            console.log(`Fetch groups rejected: ${JSON.stringify(action.error)}`)
            state.loading = false
        })
        // createNewUser
        builder.addCase(createNewUser.pending, (state) => {
            state.loading = true
        })
        builder.addCase(createNewUser.fulfilled, (state, action) => {
            state.loading = false
            state.groups = state.groups.map(g => {
                if (g.gid === action.meta.arg.gid) {
                    g.users.push(action.payload)
                }
                return g
            })
        })
        builder.addCase(createNewUser.rejected, (state) => {
            state.loading = false
        })
        // createNewGroup
        builder.addCase(createNewGroup.pending, (state) => {
            state.loading = true
        })
        builder.addCase(createNewGroup.fulfilled, (state, action) => {
            state.loading = false
            state.groups.push(action.payload)
        })
        builder.addCase(createNewGroup.rejected, (state, action) => {
            console.log(`Create user rejected: ${JSON.stringify(action.error)}`)
            state.loading = false
        })
        // createNewGroup
        builder.addCase(fetchRegisteredGroups.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchRegisteredGroups.fulfilled, (state, action) => {
            state.loading = false
            state.groups = action.payload
        })
        builder.addCase(fetchRegisteredGroups.rejected, (state, action) => {
            console.log(`Create user rejected: ${JSON.stringify(action.error)}`)
            state.loading = false
        })
    },
})

export const groupListSelector = (state: RootState) => state.group.groups

export default groupSlice.reducer

const registeredGroupsSelector = (state: RootState) => state.group.registeredGroups

export const useGroupStorage: () => [RegisteredGroup[], (groups: RegisteredGroup[]) => void] = () => {
    const registeredGroups = useAppSelector(registeredGroupsSelector)
    const dispatch = useAppDispatch()
    const setRegisteredGroups = useCallback((newRegisteredGroups) => {
        dispatch(groupSlice.actions.registerNewGroups(newRegisteredGroups))
    }, [dispatch])

    return [registeredGroups, setRegisteredGroups]
}

export const useCurrentGroup = () => {
    const dispatch = useAppDispatch()
    const allGroups = useAppSelector(groupListSelector)
    const [registeredGroups, setRegisteredGroups] = useGroupStorage()
    const router = useRouter()
    const groupIdFromRouter = router.query.groupId as string
    const groupFromRouter = registeredGroups.find(g => g.groupId === groupIdFromRouter)
    // if a new group is visited, save it to local storage
    useEffect(() => {
        if (groupFromRouter === undefined && groupIdFromRouter !== undefined) {
            console.log(`Registering a new group: ${groupIdFromRouter}`)
            const newRegisteredGroup = {
                groupId: groupIdFromRouter,
                asUserId: null
            }
            setRegisteredGroups([...registeredGroups, newRegisteredGroup])
            dispatch(fetchRegisteredGroups())
        }
    }, [registeredGroups, groupIdFromRouter])

    useEffect(() => {
        if (allGroups.length === 0) {
            dispatch(fetchRegisteredGroups())
        }
    }, [registeredGroups])
    if (groupIdFromRouter === undefined) {
        return null
    }

    const selectedGroup = allGroups.find(g => g.gid === groupIdFromRouter)
    if (!selectedGroup) {
        return null
    }


    return selectedGroup
}