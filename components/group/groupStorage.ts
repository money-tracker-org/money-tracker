import { RegisteredGroup } from '../../lib/dto/GroupCollection';


const groupStorageKey = "money_tracker_group_storage"
export const getLocalStorageRegisteredGroups: () => RegisteredGroup[] = () => {
    if (typeof window === 'undefined' || window.localStorage === undefined) {
        return []
    } else {
        const currentStorageItemString = localStorage.getItem(groupStorageKey)
        if (currentStorageItemString === null) {
            window.localStorage.setItem(groupStorageKey, JSON.stringify([]))
            return []
        }
        return JSON.parse(currentStorageItemString) as RegisteredGroup[]
    }
}

export const setLocalStorageRegisteredGroups: (groups: RegisteredGroup[]) => void = (groups: RegisteredGroup[]) => {
    if (typeof window === 'undefined' || window.localStorage === undefined) {
        return []
    }
    window.localStorage.setItem(groupStorageKey, JSON.stringify(groups))
    console.log(`Group registered into local storage as: ${JSON.stringify(groups)}`)
}
