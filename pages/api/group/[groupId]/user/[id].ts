import { getAppDataSource } from 'lib/dataSource'
import { User } from 'lib/entity/User'
import { objectToClass } from 'lib/validation'
import { NextApiRequest, NextApiResponse } from 'next'
import { DataSource } from 'typeorm'
import { Group } from '../../../../../lib/entity/Group'

const userWithId = async (
    req: NextApiRequest,
    res: NextApiResponse<Partial<User> | string>
) => {
    const id = parseInt(req.query.id as string, 10)
    const groupId = req.query.groupId as string
    const datasource = await getAppDataSource()
    if (req.method == 'GET') {
        return await getUserWithId(id, groupId, datasource, req, res)
    } else if (req.method == 'PUT') {
        return await putUserWithId(id, groupId, datasource, req, res)
    } else {
        return res.status(404).send({})
    }
}

const getUserWithId = async (
    id: number,
    groupId: string,
    datasource: DataSource,
    req: NextApiRequest,
    res: NextApiResponse<Partial<User>>
) => {
    const user = await datasource
        .getRepository(User)
        .findOne({
            select: {
                group: {}
            },
            relations: { group: true },
            where: {
                id: id,
                group: { gid: groupId }
            }
        })
    if (!!user) {
        res.status(200).json(user)
    } else {
        res.status(404).send({})
    }
}

const putUserWithId = async (
    id: number,
    groupId: string,
    datasource: DataSource,
    req: NextApiRequest,
    res: NextApiResponse<Partial<User> | string>
) => {
    const user = await objectToClass(User, req.body)
    user.id = id
    const currentUser = await datasource
        .getRepository(User)
        .findOne({
            select: {
                group: {}
            },
            relations: {
                group: true
            },
            where: {
                id: id,
                group: { gid: groupId }
            }
        })

    const group = await datasource.getRepository(Group).findOne({
        relations: { users: true },
        where: { gid: groupId }
    })
    if (!currentUser || !group) {
        res.status(404).send("Not found!")
    } else {
        const insertedUser = await datasource.getRepository(User).save(user)
        group.users = group.users.map(u => {
            if (u.id == id) {
                return insertedUser
            }
            return u
        })
        await datasource.getRepository(Group).save(group)
        res.status(204).json(insertedUser)
    }
}

export default userWithId
export const testingExports = {
    getUserWithId,
    putUserWithId,
}
