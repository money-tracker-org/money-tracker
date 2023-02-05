import { NextApiRequest } from 'next';
import { User } from '../../../lib/entity/User';
import { mockRes } from '../../../lib/__test__/apiMocks';
import { getEmptyTestDataSource } from '../../../lib/__test__/testDataSource';
import { testingExports } from './[id]';

test('GET existing user', async () => {
    const ds = await getEmptyTestDataSource()
    const user = {
        id: 1,
        firstName: "testname",
        lastName: "lastname"
    }
    const insertedUser = await ds.getRepository(User).save(user)
    await testingExports.getUserWithId(1, ds, {} as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(200)
    expect(mockRes.json).toBeCalledWith(insertedUser)
});

test('GET missing user', async () => {
    const ds = await getEmptyTestDataSource()
    await testingExports.getUserWithId(1, ds, {} as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(404)
    expect(mockRes.send).toBeCalledWith({})
});


test('PUT existing user', async () => {
    const ds = await getEmptyTestDataSource()
    const user = {
        id: 1,
        firstName: "testname",
        lastName: "lastname"
    }
    await ds.getRepository(User).save(user)
    user.firstName = "test"
    await testingExports.putUserWithId(1, ds, { body: user } as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(204)
    expect(mockRes.json).toBeCalledWith(user)
});

test('PUT missing user', async () => {
    const ds = await getEmptyTestDataSource()
    const user = {
        id: 1,
        firstName: "testname",
        lastName: "lastname"
    }
    await testingExports.putUserWithId(1, ds, { body: user } as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(404)
    expect(mockRes.send).toBeCalledWith({})
});