import 'reflect-metadata'
import { DataSource } from 'typeorm'

let EmptyInMemoryDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: false,
    entities: ['./lib/entity/*.{ts,js}'],
}).initialize()

afterEach(async () => {
    EmptyInMemoryDataSource = new DataSource({
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        logging: false,
        entities: ['./lib/entity/*.{ts,js}'],
    }).initialize()
    await EmptyInMemoryDataSource
})

export const getEmptyTestDataSource = async () => await EmptyInMemoryDataSource
