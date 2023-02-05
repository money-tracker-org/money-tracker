
import { NextApiRequest, NextApiResponse } from 'next';
import { DataSource } from 'typeorm';
import { getAppDataSource } from '../../../lib/dataSource';
import { User } from '../../../lib/entity/User';
import { objectToClass } from '../../../lib/validation';

const user = async (req: NextApiRequest, res: NextApiResponse<User[] | User>) => {
    const datasource = await getAppDataSource()
    if (req.method == "GET") {
        return await getUser(datasource, req, res)
    } else if (req.method == "POST") {
        return await postUser(datasource, req, res)
    } else {
        res.status(404)
    }
}

const getUser = async (datasource: DataSource, req: NextApiRequest, res: NextApiResponse<User[]>) => {
    return res.status(200).json(await datasource.getRepository(User).find())
}

const postUser = async (datasource: DataSource, req: NextApiRequest, res: NextApiResponse<User[] | User>) => {
    const user = await objectToClass(User, req.body) as Partial<User>
    delete user.id
    const createdUser = await datasource.getRepository(User).save(user)
    res.status(201).json(createdUser)
}

export default user

export const testingExports = {
    getUser, postUser
}