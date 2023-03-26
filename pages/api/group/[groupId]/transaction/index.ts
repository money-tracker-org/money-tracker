import { getAppDataSource } from 'lib/dataSource'
import { Payment } from 'lib/entity/Payment'
import { Transaction } from 'lib/entity/Transaction'
import { User } from 'lib/entity/User'
import { objectToClass } from 'lib/validation'
import { NextApiRequest, NextApiResponse } from 'next'
import { DataSource, In } from 'typeorm'
import { Group } from '../../../../../lib/entity/Group'

const transaction = async (
    req: NextApiRequest,
    res: NextApiResponse<Transaction[] | Transaction | string>
) => {
    const datasource = await getAppDataSource()
    const groupId = req.query.groupId as string
    if (req.method == 'GET') {
        return await getTransaction(groupId, datasource, req, res)
    } else if (req.method == 'POST') {
        return await postTransaction(groupId, datasource, req, res)
    } else {
        res.status(404).send('Not found!')
    }
}

const getTransaction = async (
    groupId: string,
    datasource: DataSource,
    req: NextApiRequest,
    res: NextApiResponse<Transaction[] | string>
) => {
    const transactions = await datasource
        .getRepository(Transaction)
        .find({
            select: {
                payments: {
                    amountInEur: true,
                    id: true,
                    user: {
                        id: true,
                        displayName: true,
                        disabled: true,
                        group: {}
                    }
                }
            },
            relations: {
                payments: {
                    user: {
                        group: true
                    }
                }
            },
            where: {
                payments: {
                    user: {
                        group: {
                            gid: groupId
                        }
                    }
                }
            },
            order: {
                date: "DESC",
                payments: {
                    user: {
                        displayName: "DESC"
                    }
                }
            }

        })
    if (transactions === null) {
        return res.status(404).send("Not found!")
    }
    // console.log(`Seleceted transactions: ${JSON.stringify(transactions, undefined, 2)}`)
    return res.status(200).json(transactions)
}

const postTransaction = async (
    groupId: string,
    datasource: DataSource,
    req: NextApiRequest,
    res: NextApiResponse<Transaction | string>
) => {
    const transaction = (await objectToClass(
        Transaction,
        req.body
    )) as Partial<Transaction>
    delete transaction.id
    const group = await datasource.getRepository(Group).findOne({ where: { gid: groupId } })
    if (group === null) {
        return res.status(404).send("Not found!")
    }
    if (!transaction.payments) {
        return res.status(400).send("Can not add transaction without payments")
    }
    transaction.payments = transaction.payments?.map((p: Partial<Payment>) => {
        p.user = {
            id: p.user?.id ?? undefined,
            group: {
                gid: group.gid
            } as Group
        } as User
        delete p.id
        return p as Payment
    })
    const dbUsers = await datasource.getRepository(User).findAndCount({
        where: {
            id: In(transaction.payments.map(p => p.user.id))
        }
    })
    if (dbUsers[1] != transaction.payments.length) {
        return res.status(400).send("Invalid payments specified")
    }
    const createdTransaction = await datasource.getRepository(Transaction).save(transaction)
    if (createdTransaction === null) {
        return res.status(404).send("Not found!")
    }
    createdTransaction.payments = createdTransaction.payments.map((p: Payment | { user: Partial<User> }) => {
        delete p.user.group
        return p as Payment
    })
    res.status(201).json(createdTransaction)
}

export default transaction

export const testingExports = {
    getTransaction,
    postTransaction,
}
