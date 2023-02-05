// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'

const health = (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ health: 'OK' })
}

export default health
