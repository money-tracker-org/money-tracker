import { Group } from 'lib/entity/Group'
import { User } from 'lib/entity/User'
import { ValidationException } from 'lib/validation'
import { mockRes } from 'lib/__test__/apiMocks'
import { getEmptyTestDataSource } from 'lib/__test__/testDataSource'
import { NextApiRequest } from 'next'
import { testingExports } from '.'
import { getSeededTestDataSource, SeedGroup } from '../../../lib/__test__/testDataSource'

test('GET all groups', async () => {
    const ds = await getSeededTestDataSource()
    await testingExports.getGroups(ds, {} as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(200)
    expect(mockRes.json).toBeCalledWith([SeedGroup])
})

type PartialUsers = { users: Partial<User>[] }

test('POST new group', async () => {
    const ds = await getEmptyTestDataSource()
    const group: Partial<Group> | PartialUsers = {
        name: 'testGroup',
        users: [
            { id: 1, displayName: 'test1', disabled: false },
            { id: 2, displayName: 'test2', disabled: false },
        ],
    }
    await testingExports.postGroup(
        ds,
        { body: group } as NextApiRequest,
        mockRes
    )
    expect(mockRes.status).toBeCalledWith(201)
    const responseClassObject = mockRes.json.mock.calls[0][0]
    const plainObject = JSON.parse(JSON.stringify(responseClassObject))
    expect(plainObject.gid).not.toBeNull()
    delete plainObject.gid
    expect(plainObject).toStrictEqual({ ...group })
    const users = await ds.getRepository(User).find()
    expect(users.length).toBe(2)
    expect(users.find(u => u.id === 1)?.displayName).toBe("test1")
    expect(users.find(u => u.id === 2)?.displayName).toBe("test2")
})

test('POST new group without users fails', async () => {
    const ds = await getEmptyTestDataSource()
    const group: Partial<Group> | PartialUsers = {
        users: [],
    }
    try {
        await testingExports.postGroup(
            ds,
            { body: group } as NextApiRequest,
            mockRes
        )
    } catch (e) {
        expect(e).toBeInstanceOf(ValidationException)
        expect(JSON.stringify((e as ValidationException).errors)).toContain(
            'users should not be empty'
        )
    }
})
