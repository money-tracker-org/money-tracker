import { createSlice } from '@reduxjs/toolkit';
import { apiClient } from 'components/apiClient';
import { createAppAsyncThunk, RootState } from 'components/typedStore';
import { Group } from 'lib/entity/Group';
import { User } from 'lib/entity/User';

export interface GroupState {
    groups: Group[]
    loading: boolean
    error?: Error
}

const initialState: GroupState = {
    groups: [],
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
        const backendUrl = thunkAPI.getState().global.backendUrl
        return await apiClient.createNewGroup(group, backendUrl)
    },
    {
        condition: (_, thunkAPI) => !thunkAPI.getState().group.loading
    }
)

export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
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
    },
})

export const groupListSelector = (state: RootState) => state.group.groups

export default groupSlice.reducer
