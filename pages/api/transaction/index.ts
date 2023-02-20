import { NextApiRequest, NextApiResponse } from 'next'
import { DataSource } from 'typeorm'
import { getAppDataSource } from '../../../lib/dataSource'
import { Transaction } from '../../../lib/entity/Transaction'
import { objectToClass } from '../../../lib/validation'

const transaction = async (
    req: NextApiRequest,
    res: NextApiResponse<Transaction[] | Transaction>
) => {
    const datasource = await getAppDataSource()
    if (req.method == 'GET') {
        return await getTransaction(datasource, req, res)
    } else if (req.method == 'POST') {
        return await postTransaction(datasource, req, res)
    } else {
        res.status(404)
    }
}

const getTransaction = async (
    datasource: DataSource,
    req: NextApiRequest,
    res: NextApiResponse<Transaction[]>
) => {
    return res
        .status(200)
        .json(
            await datasource
                .getRepository(Transaction)
                .find({ relations: ['payments', 'payments.user'] })
        )
}

const postTransaction = async (
    datasource: DataSource,
    req: NextApiRequest,
    res: NextApiResponse<Transaction[] | Transaction>
) => {
    const transaction = (await objectToClass(
        Transaction,
        req.body
    )) as Partial<Transaction>
    delete transaction.id
    const createdTransaction = await datasource
        .getRepository(Transaction)
        .save(transaction)
    res.status(201).json(createdTransaction)
}

export default transaction

export const testingExports = {
    getTransaction,
    postTransaction,
}
