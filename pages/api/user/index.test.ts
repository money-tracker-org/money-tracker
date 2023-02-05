import { NextApiRequest } from 'next';
import { User } from '../../../lib/entity/User';
import { mockRes } from '../../../lib/__test__/apiMocks';
import { getEmptyTestDataSource } from '../../../lib/__test__/testDataSource';
import { testingExports } from './index';

test('GET all users', async () => {
    const ds = await getEmptyTestDataSource()
    await ds.getRepository(User).save([
        { firstName: "test1", lastName: "test2" },
        { firstName: "test3", lastName: "test4" },
    ])
    await testingExports.getUser(ds, {} as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(200)
    expect(mockRes.json).toBeCalledWith([
        { id: 1, firstName: "test1", lastName: "test2" },
        { id: 2, firstName: "test3", lastName: "test4" },
    ])
});

test('POST new user', async () => {
    const ds = await getEmptyTestDataSource()
    const user: Partial<User> = {
        id: 420,
        firstName: "test1",
        lastName: "test2"
    }
    await testingExports.postUser(ds, { body: user } as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(201)
    expect(mockRes.json).toBeCalledWith(
        // id from the request should be discarded:
        { id: 1, firstName: "test1", lastName: "test2" },
    )
});
