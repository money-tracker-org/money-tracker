import { Group } from "lib/entity/Group"
import { Transaction } from "lib/entity/Transaction"
import { User } from "lib/entity/User"

const defaultFetchParams = {
    headers: { 'Content-Type': 'application/json' },
}

const groupApi = {
    createNewGroup: async (group: Partial<Group>, baseUrl: string) => {
        const response = await fetch(
            `${baseUrl}/api/group`,
            {
                body: JSON.stringify(group),
                method: 'POST',
                ...defaultFetchParams,
            }
        )
        return await response.json() as Group
    },
    fetchGroups: async (baseUrl: string) => {
        const response = await fetch(
            `${baseUrl}/api/group`,
            defaultFetchParams
        )
        return await response.json() as Group[]
    },
    createNewUser: async (user: Partial<User>, gid: string | null, baseUrl: string) => {
        const response = await fetch(
            `${baseUrl}/api/group/${gid}/user`,
            {
                body: JSON.stringify(user),
                method: 'POST',
                ...defaultFetchParams
            }
        )
        return await response.json() as User
    },
    editUser: async (user: { id: number } & Partial<User>, gid: string | null, baseUrl: string) => {
        const response = await fetch(
            `${baseUrl}/api/group/${gid}/user`,
            {
                body: JSON.stringify(user),
                method: 'PUT',
                ...defaultFetchParams
            }
        )
        return await response.json() as User
    }
}

const transactionApi = {
    fetchTransactions: async (gid: string | null, backendUrl: string) => {
        const response = await fetch(
            `${backendUrl}/api/group/${gid}/transaction`
        )
        return await response.json() as Transaction[]
    }
}

export const apiClient = {
    ...groupApi,
    ...transactionApi
}