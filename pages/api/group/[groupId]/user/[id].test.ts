import { User } from 'lib/entity/User'
import { mockRes } from 'lib/__test__/apiMocks'
import { getEmptyTestDataSource } from 'lib/__test__/testDataSource'
import { NextApiRequest } from 'next'
import { Group } from '../../../../../lib/entity/Group'
import { getSeededTestDataSource, SeedGroup } from '../../../../../lib/__test__/testDataSource'
import { testingExports } from './[id]'

test('GET existing user', async () => {
    const ds = await getSeededTestDataSource()
    await testingExports.getUserWithId(SeedGroup.users[0].id, SeedGroup.gid, ds, {} as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(200)
    expect(mockRes.json).toBeCalledWith(SeedGroup.users[0])
})

test('GET missing user from missing group', async () => {
    const ds = await getSeededTestDataSource()
    await testingExports.getUserWithId(1, "missing", ds, {} as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(404)
    expect(mockRes.send).toBeCalledWith({})
})

test('GET missing user from existing group', async () => {
    const ds = await getSeededTestDataSource()
    await testingExports.getUserWithId(420, SeedGroup.gid, ds, {} as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(404)
    expect(mockRes.send).toBeCalledWith({})
})

test('PUT existing user changed name', async () => {
    const ds = await getSeededTestDataSource()
    const user = SeedGroup.users[0]
    user.displayName = 'test'
    user.disabled = true
    await testingExports.putUserWithId(
        user.id,
        SeedGroup.gid,
        ds,
        { body: user } as NextApiRequest,
        mockRes
    )
    expect(mockRes.status).toBeCalledWith(204)
    expect(mockRes.json).toBeCalledWith(user)
    const group = await ds.getRepository(Group).findOne({
        where: { gid: SeedGroup.gid },
        relations: { users: true }
    })
    const groupUser = group?.users.find(u => u.id = user.id)
    expect({ ...groupUser }).toStrictEqual(user)
})

test('PUT missing user to missing group', async () => {
    const ds = await getEmptyTestDataSource()
    const user: Partial<User> = {
        id: 1,
        displayName: 'testuser',
    }
    await testingExports.putUserWithId(
        1,
        "missing",
        ds,
        { body: user } as NextApiRequest,
        mockRes
    )
    expect(mockRes.status).toBeCalledWith(404)
    expect(mockRes.send).toBeCalled()
})

test('PUT missing user to existing group', async () => {
    const ds = await getSeededTestDataSource()
    const user = {
        id: 420,
        displayName: 'testuser',
        disabled: false,
    }
    await testingExports.putUserWithId(
        user.id,
        SeedGroup.gid,
        ds,
        { body: user } as NextApiRequest,
        mockRes
    )
    expect(mockRes.status).toBeCalledWith(404)
    expect(mockRes.send).toBeCalled()
})
