/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextApiResponse } from 'next'

interface MockApiResponse {
    status: jest.Mock
    json: jest.Mock
    send: jest.Mock
}

export const mockRes: MockApiResponse & NextApiResponse = {
    status: jest.fn((code: number) => mockRes),
    json: jest.fn((obj: object) => { }),
    send: jest.fn((obj: object) => { }),
} as unknown as MockApiResponse & NextApiResponse

afterEach(() => {
    mockRes.status.mockClear()
    mockRes.json.mockClear()
    mockRes.send.mockClear()
})
