import { User } from 'lib/entity/User'
import { mockRes } from 'lib/__test__/apiMocks'
import { NextApiRequest } from 'next'
import { testingExports } from '.'
import { getSeededTestDataSource, SeedGroup } from '../../../../../lib/__test__/testDataSource'

test('GET all users', async () => {
    const ds = await getSeededTestDataSource()
    await testingExports.getUser(SeedGroup.gid, ds, {} as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(200)
    expect(mockRes.json).toBeCalledWith([
        { id: 1, displayName: 'user1', disabled: false },
        { id: 2, displayName: 'user2', disabled: false },
    ])
})

test('GET all users from a missing group', async () => {
    const ds = await getSeededTestDataSource()
    await testingExports.getUser("missing", ds, {} as NextApiRequest, mockRes)
    expect(mockRes.send).toBeCalled()
    expect(mockRes.status).toBeCalledWith(404)
})

test('POST new user', async () => {
    const ds = await getSeededTestDataSource()
    const user: Partial<User> = {
        id: 420,
        displayName: 'user3',
    }
    await testingExports.postUser(SeedGroup.gid, ds, { body: user } as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(201)
    expect(mockRes.json).toBeCalledWith(
        // id from the request should be discarded:
        { id: 3, displayName: 'user3', disabled: false }
    )
})

test('POST new user to a non-existing group', async () => {
    const ds = await getSeededTestDataSource()
    const user: Partial<User> = {
        id: 420,
        displayName: 'user3',
    }
    await testingExports.postUser("missing", ds, { body: user } as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(404)
    expect(mockRes.send).toBeCalled()
})
