import { randomUUID } from 'crypto'
import { getAppDataSource } from 'lib/dataSource'
import { Group } from 'lib/entity/Group'
import { objectToClass } from 'lib/validation'
import { NextApiRequest, NextApiResponse } from 'next'
import { DataSource } from 'typeorm'

const group = async (
    req: NextApiRequest,
    res: NextApiResponse<Group[] | Group | string>
) => {
    const datasource = await getAppDataSource()
    if (req.method == 'GET') {
        return await getGroups(datasource, req, res)
    } else if (req.method == 'POST') {
        return await postGroup(datasource, req, res)
    } else {
        res.status(404).send('Not found!')
    }
}

const getGroups = async (
    datasource: DataSource,
    req: NextApiRequest,
    res: NextApiResponse<Group[]>
) => {
    return res
        .status(200)
        .json(
            await datasource.getRepository(Group).find({ relations: ['users'] })
        )
}

const postGroup = async (
    datasource: DataSource,
    req: NextApiRequest,
    res: NextApiResponse<Group>
) => {
    const group = await objectToClass(Group, req.body)
    group.gid = randomUUID()
    const createdGroup = await datasource.getRepository(Group).save(group)
    res.status(201).json(createdGroup)
}

export default group

export const testingExports = {
    getGroups,
    postGroup,
}
