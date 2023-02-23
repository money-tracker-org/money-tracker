import { Payment } from 'lib/entity/Payment'
import { Transaction } from 'lib/entity/Transaction'
import { User } from 'lib/entity/User'
import { mockRes } from 'lib/__test__/apiMocks'
import { getSeededTestDataSource, SeedGroup, SeedTransactions } from 'lib/__test__/testDataSource'
import { NextApiRequest } from 'next'
import { testingExports } from './index'

test('GET all transactions', async () => {
    const ds = await getSeededTestDataSource()
    await testingExports.getTransaction(SeedGroup.gid, ds, {} as NextApiRequest, mockRes)
    expect(mockRes.status).toBeCalledWith(200)
    const responseTransactions = mockRes.json.mock.calls[0][0] as Transaction[]
    expect(responseTransactions.length).toBe(1)
    SeedTransactions[0].payments.forEach(seedPayment => {
        const receivedPayment = responseTransactions[0].payments.find(p => p.id == seedPayment.id) as Payment
        expect(receivedPayment.user.id).toBe(seedPayment.user.id)
        receivedPayment.user = { id: receivedPayment.user.id } as User
        expect(JSON.parse(JSON.stringify(receivedPayment))).toStrictEqual(seedPayment)
    })
})

test('POST new transaction', async () => {
    const ds = await getSeededTestDataSource()
    const transaction: Transaction = {
        id: 420,
        title: 'test1',
        date: new Date().toISOString(),
        payments: [
            { id: 1, amountInEur: 10, user: { id: SeedGroup.users[0].id } } as Payment,
            { id: 1, amountInEur: -10, user: { id: SeedGroup.users[1].id } } as Payment,
        ],
    }
    await testingExports.postTransaction(
        SeedGroup.gid,
        ds,
        { body: transaction } as NextApiRequest,
        mockRes
    )
    expect(mockRes.status).toBeCalledWith(201)
    transaction.id = 2
    transaction.payments[0].id = 3
    transaction.payments[1].id = 4
    expect(mockRes.json).toBeCalledWith(transaction)
})

test('POST new transaction with missing user', async () => {
    const ds = await getSeededTestDataSource()
    const transaction: Transaction = {
        id: 1,
        title: 'test1',
        date: new Date().toISOString(),
        payments: [{ id: 1, amountInEur: 10, user: { id: 420 } } as Payment],
    }
    await testingExports.postTransaction(
        SeedGroup.gid,
        ds,
        { body: transaction } as NextApiRequest,
        mockRes
    )
    expect(mockRes.status).toBeCalledWith(400)
    expect(mockRes.send).toBeCalled()
})

test('POST new transaction with missing group', async () => {
    const ds = await getSeededTestDataSource()
    const transaction = {
        title: 'test1',
        date: new Date().toISOString(),
        payments: [{ id: 1, amountInEur: 10, user: { id: 420 } } as Payment],
    } as Transaction
    await testingExports.postTransaction(
        "missing",
        ds,
        { body: transaction } as NextApiRequest,
        mockRes
    )
    expect(mockRes.status).toBeCalledWith(404)
    expect(mockRes.send).toBeCalled()
})
