import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { User } from '../../lib/entity/User'
import { AppDispatch, AppGetState, RootState } from '../../pages/store'

export interface UserState {
    users: User[]
    loading: boolean
    error?: Error
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: undefined,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        createNewUserStarted: (state) => {
            state.loading = true
        },
        createNewUserError: (state, action: PayloadAction<Error>) => {
            state.error = action.payload
        },
        createNewUserSuccess: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload)
            state.loading = false
        },
        fetchUsersStarted: (state) => {
            state.loading = true
        },
        fetchUsersError: (state, action: PayloadAction<Error>) => {
            state.error = action.payload
            state.loading = false
        },
        fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload
            state.loading = false
        },
    },
})

export const createNewUser =
    (user: Partial<User>) =>
    async (dispatch: AppDispatch, getState: AppGetState) => {
        dispatch(userSlice.actions.createNewUserStarted())
        try {
            const response = await fetch(
                `${getState().global.backendUrl}/api/user`,
                {
                    body: JSON.stringify(user),
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            const createdUser = await response.json()
            dispatch(userSlice.actions.createNewUserSuccess(createdUser))
        } catch (e) {
            dispatch(userSlice.actions.createNewUserError(e as Error))
        }
    }

export const fetchUsersIfNotFound =
    () => async (dispatch: AppDispatch, getState: AppGetState) => {
        const usersState = getState().user
        if (
            !!usersState.error ||
            usersState.loading ||
            usersState.users.length > 0
        ) {
            return
        }
        dispatch(userSlice.actions.fetchUsersStarted())
        try {
            const response = await fetch(
                `${getState().global.backendUrl}/api/user`
            )
            const users = await response.json()
            dispatch(userSlice.actions.fetchUsersSuccess(users))
        } catch (e) {
            dispatch(userSlice.actions.fetchUsersError(e as Error))
        }
    }

export const userListSelector = (state: RootState) => state.user.users

export default userSlice.reducer
