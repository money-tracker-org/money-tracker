import { NextApiRequest } from 'next';
import { Transaction } from '../../../lib/entity/Transaction';
import { mockRes } from '../../../lib/__test__/apiMocks';
import { getEmptyTestDataSource } from '../../../lib/__test__/testDataSource';
import { testingExports } from './index';

test('GET all transactions', async () => {
    const ds = await getEmptyTestDataSource()
    const transactions: Transaction[] = [
        { id: 1, title: "test1", date: new Date().toISOString(), payments: [] }
    ]
    await ds.getRepository(Transaction).save(transactions)
    await testingExports.getTransaction(ds, {} as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(200)
    expect(mockRes.json).toBeCalledWith(transactions)
});

test('POST new transaction', async () => {
    const ds = await getEmptyTestDataSource()
    const transaction: Transaction = {
        id: 1,
        title: "test1",
        date: new Date().toISOString(),
        payments: [{ id: 1, amountInEur: 10 } as any]
    }
    await testingExports.postTransaction(ds, { body: transaction } as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(201)
    expect(mockRes.json).toBeCalledWith(transaction)
});

test('POST new transaction with user', async () => {
    const ds = await getEmptyTestDataSource()
    const transaction: Transaction = {
        id: 1,
        title: "test1",
        date: new Date().toISOString(),
        payments: [{ id: 1, amountInEur: 10 } as any]
    }
    await testingExports.postTransaction(ds, { body: transaction } as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(201)
    expect(mockRes.json).toBeCalledWith(transaction)
});