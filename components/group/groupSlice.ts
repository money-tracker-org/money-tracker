import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Group } from 'lib/entity/Group'
import { User } from 'lib/entity/User'
import { AppDispatch, AppGetState, RootState } from 'pages/store'

export interface GroupState {
    selectedGroupId: string | null
    groups: Group[]
    loading: boolean
    error?: Error
}

const initialState: GroupState = {
    groups: [],
    selectedGroupId: null,
    loading: false,
    error: undefined,
}

interface CreateUserSuccessPayload {
    user: User
    group: Group
}

export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        createNewGroupStarted: (state) => {
            state.loading = true
        },
        createNewGroupError: (state, action: PayloadAction<Error>) => {
            state.error = action.payload
        },
        createNewGroupSuccess: (state, action: PayloadAction<Group>) => {
            state.groups.push(action.payload)
            state.loading = false
        },
        createNewUserStarted: (state) => {
            state.loading = true
        },
        createNewUserError: (state, action: PayloadAction<Error>) => {
            state.error = action.payload
        },
        createNewUserSuccess: (state, action: PayloadAction<CreateUserSuccessPayload>) => {
            state.groups = state.groups.map(g => {
                if (g.gid === action.payload.group.gid) {
                    g.users.push(action.payload.user)
                }
                return g
            })
            state.loading = false
        },
        fetchGroupsStarted: (state) => {
            state.loading = true
        },
        fetchGroupsError: (state, action: PayloadAction<Error>) => {
            state.error = action.payload
            state.loading = false
        },
        fetchGroupsSuccess: (state, action: PayloadAction<Group[]>) => {
            state.groups = action.payload
            state.loading = false
        },
        setCurrentGroupId: (state, action: PayloadAction<string | null>) => {
            state.selectedGroupId = action.payload
            console.log(`Selected group: ${action.payload}`)
        }
    },
})

export const createNewGroup =
    (user: Partial<Group>) =>
        async (dispatch: AppDispatch, getState: AppGetState) => {
            dispatch(groupSlice.actions.createNewGroupStarted())
            try {
                const response = await fetch(
                    `${getState().global.backendUrl}/api/group`,
                    {
                        body: JSON.stringify(user),
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                    }
                )
                const createdGroup = await response.json()
                dispatch(groupSlice.actions.createNewGroupSuccess(createdGroup))
            } catch (e) {
                dispatch(groupSlice.actions.createNewGroupError(e as Error))
            }
        }

export const fetchGroupsIfNotFound =
    () => async (dispatch: AppDispatch, getState: AppGetState) => {
        const groupState = getState().group
        if (
            !!groupState.error ||
            groupState.loading ||
            groupState.groups.length > 0
        ) {
            return
        }
        dispatch(groupSlice.actions.fetchGroupsStarted())
        try {
            const response = await fetch(
                `${getState().global.backendUrl}/api/group`
            )
            const groups = await response.json()
            dispatch(groupSlice.actions.fetchGroupsSuccess(groups))
        } catch (e) {
            dispatch(groupSlice.actions.fetchGroupsError(e as Error))
        }
    }

export const createNewUser =
    (user: Partial<User>, group: Group | null) =>
        async (dispatch: AppDispatch, getState: AppGetState) => {
            if (!group?.gid) return
            dispatch(groupSlice.actions.createNewUserStarted())
            try {
                const response = await fetch(
                    `${getState().global.backendUrl}/api/group/${group.gid}/user`,
                    {
                        body: JSON.stringify(user),
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                    }
                )
                const createdUser = await response.json()
                dispatch(groupSlice.actions.createNewUserSuccess({ group: group, user: createdUser }))
            } catch (e) {
                dispatch(groupSlice.actions.createNewUserError(e as Error))
            }
        }

export const groupListSelector = (state: RootState) => state.group.groups
export const currentGroupIdSelector = (state: RootState) => state.group.selectedGroupId
export const { setCurrentGroupId } = groupSlice.actions

export default groupSlice.reducer
