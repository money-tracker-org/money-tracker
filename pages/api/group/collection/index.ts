import { getAppDataSource } from 'lib/dataSource'
import { Group } from 'lib/entity/Group'
import { objectToClass } from 'lib/validation'
import { NextApiRequest, NextApiResponse } from 'next'
import { DataSource, In } from 'typeorm'
import { GroupCollection } from '../../../../lib/dto/GroupCollection'

const groupCollection = async (
    req: NextApiRequest,
    res: NextApiResponse<Group[] | string>
) => {
    const datasource = await getAppDataSource()
    if (req.method == 'POST') {
        return await createNewCollection(datasource, req, res)
    } else {
        res.status(404).send('Not found!')
    }
}

const createNewCollection = async (
    datasource: DataSource,
    req: NextApiRequest,
    res: NextApiResponse<Group[]>
) => {
    const groupCollection = await objectToClass(GroupCollection, req.body)
    const groupIds = groupCollection.groups.map(g => g.groupId)
    const createdGroup = await datasource.getRepository(Group).find(
        {
            relations: {
                users: true
            },
            where: {
                gid: In(groupIds)
            }
        }
    )
    return res.status(201).json(createdGroup)
}

export default groupCollection

export const testingExports = {
    createNewCollection,
}
