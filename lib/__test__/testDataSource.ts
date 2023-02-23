import 'reflect-metadata';

import { Payment } from 'lib/entity/Payment';
import { User } from 'lib/entity/User';
import { DataSource } from 'typeorm';
import { Group } from '../entity/Group';
import { Transaction } from '../entity/Transaction';


const makeInMemoryDataSource = async () => {
    return await new DataSource({
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        logging: false,
        entities: ['./lib/entity/*.{ts,js}'],
    }).initialize()
}

export const SeedGroup: Group = {
    gid: "group",
    name: "group1",
    users: [
        { id: 1, displayName: "user1", disabled: false } as User,
        { id: 2, displayName: "user2", disabled: false } as User,
    ]
}

export const SeedTransactions: Transaction[] = [
    {
        id: 1,
        title: "testTransaction1",
        date: new Date("2024-07-21").toISOString(),
        payments: [
            { id: 1, user: { id: SeedGroup.users[0].id }, amountInEur: 1 } as Payment,
            { id: 2, user: { id: SeedGroup.users[0].id }, amountInEur: -1 } as Payment
        ]
    }
]

export const getSeededTestDataSource = async () => {
    const ds = await makeInMemoryDataSource()
    await ds.getRepository(Group).save(SeedGroup)
    await ds.getRepository(Transaction).save(SeedTransactions)
    return ds
}


export const getEmptyTestDataSource = async () => await makeInMemoryDataSource()
