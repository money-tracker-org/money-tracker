import { getAppDataSource } from 'lib/dataSource'
import { User } from 'lib/entity/User'
import { objectToClass } from 'lib/validation'
import { NextApiRequest, NextApiResponse } from 'next'
import { DataSource } from 'typeorm'
import { Group } from '../../../../../lib/entity/Group'

const user = async (
    req: NextApiRequest,
    res: NextApiResponse<User[] | User | string>
) => {
    const datasource = await getAppDataSource()
    const groupId = req.query.groupId as string
    if (req.method == 'GET') {
        return await getUser(groupId, datasource, req, res)
    } else if (req.method == 'POST') {
        return await postUser(groupId, datasource, req, res)
    } else {
        res.status(404).send('Not found!')
    }
}

const getUser = async (
    groupId: string,
    datasource: DataSource,
    req: NextApiRequest,
    res: NextApiResponse<User[] | string>
) => {
    const group = await datasource.getRepository(Group).findOne({ where: { gid: groupId } })
    if (group === null) {
        return res.status(404).send("Not found!")
    }
    const users = await datasource.getRepository(User).find({
        select: {
            id: true,
            displayName: true,
            disabled: true,
            group: {},
        },
        relations: {
            group: true
        },
        where: {
            group: {
                gid: groupId
            }
        }
    })
    if (users === null) {
        return res.status(404).send("Not found!")
    }

    return res.status(200).json(users)
}

const postUser = async (
    gid: string,
    datasource: DataSource,
    req: NextApiRequest,
    res: NextApiResponse<User[] | User | string>
) => {
    const user = (await objectToClass(User, req.body)) as Partial<User>
    delete user.id
    const group = await datasource.getRepository(Group).findOne({
        relations: {
            users: true
        },
        where: {
            gid: gid
        }
    })
    if (group === null) {
        res.status(404).send("Not found!")
        return
    }
    const createdUser = await datasource.getRepository(User).save(user)
    group.users.push(createdUser)
    await datasource.getRepository(Group).save(group)
    res.status(201).json(createdUser)
}

export default user

export const testingExports = {
    getUser,
    postUser,
}
