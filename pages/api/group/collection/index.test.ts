import { GroupCollection, RegisteredGroup } from 'lib/dto/GroupCollection';
import { mockRes } from "lib/__test__/apiMocks";
import { getSeededTestDataSource } from "lib/__test__/testDataSource";
import { NextApiRequest } from "next";
import { testingExports } from ".";
import { SeedGroup } from '../../../../lib/__test__/testDataSource';

test('POST new group collection and fetch groups', async () => {
    const ds = await getSeededTestDataSource()
    const gc: GroupCollection = {
        groups: [
            { groupId: "group" } as RegisteredGroup
        ]
    }
    await testingExports.createNewCollection(ds, { body: gc } as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(201)
    expect(mockRes.json).toBeCalledWith([SeedGroup])
})