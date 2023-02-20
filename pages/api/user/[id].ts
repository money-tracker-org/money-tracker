import { NextApiRequest, NextApiResponse } from 'next'
import { DataSource } from 'typeorm'
import { getAppDataSource } from '../../../lib/dataSource'
import { User } from '../../../lib/entity/User'
import { objectToClass } from '../../../lib/validation'

const userWithId = async (
    req: NextApiRequest,
    res: NextApiResponse<Partial<User>>
) => {
    const id = parseInt(req.query.id as string, 10)
    const datasource = await getAppDataSource()
    if (req.method == 'GET') {
        return await getUserWithId(id, datasource, req, res)
    } else if (req.method == 'PUT') {
        return await putUserWithId(id, datasource, req, res)
    } else {
        return res.status(404).send({})
    }
}

const getUserWithId = async (
    id: number,
    datasource: DataSource,
    req: NextApiRequest,
    res: NextApiResponse<Partial<User>>
) => {
    const user = await datasource
        .getRepository(User)
        .findOne({ where: { id: id } })
    if (!!user) {
        res.status(200).json(user)
    } else {
        res.status(404).send({})
    }
}

const putUserWithId = async (
    id: number,
    datasource: DataSource,
    req: NextApiRequest,
    res: NextApiResponse<Partial<User>>
) => {
    const user = await objectToClass(User, req.body)
    user.id = id
    const currentUser = await datasource
        .getRepository(User)
        .findOne({ where: { id: id } })
    if (!currentUser) {
        // use the POST endpoint for making new users..
        res.status(404).send({})
    } else {
        const insertedUser = await datasource.manager.save(user)
        res.status(204).json(insertedUser)
    }
}

export default userWithId
export const testingExports = {
    getUserWithId,
    putUserWithId,
}
