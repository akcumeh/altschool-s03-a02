import { Request, Response } from 'express';
import { createUser } from '../controllers/userController';
import { supabase } from '../db';

jest.mock('../db', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

const mockFrom = supabase.from as jest.Mock;

function makeReq(body: Record<string, unknown>): Request {
    return { body } as Request;
}

function makeRes(): jest.Mocked<Response> {
    const res = {} as jest.Mocked<Response>;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

function mockChain(result: { data: unknown; error: unknown }) {
    const chain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue(result),
    };
    mockFrom.mockReturnValue(chain);
    return chain;
}

describe('createUser', () => {
    beforeEach(() => jest.clearAllMocks());

    it('returns 400 when username is missing', async () => {
        const res = makeRes();
        await createUser(makeReq({ email: 'a@b.com', date_of_birth: '1990-01-01' }), res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 400 when email is missing', async () => {
        const res = makeRes();
        await createUser(makeReq({ username: 'angel', date_of_birth: '1990-01-01' }), res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 400 when date_of_birth is missing', async () => {
        const res = makeRes();
        await createUser(makeReq({ username: 'angel', email: 'a@b.com' }), res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 400 when email is invalid', async () => {
        const res = makeRes();
        await createUser(makeReq({ username: 'angel', email: 'notanemail', date_of_birth: '1990-01-01' }), res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 409 on duplicate email (error code 23505)', async () => {
        mockChain({ data: null, error: { code: '23505', message: 'duplicate key' } });
        const res = makeRes();
        await createUser(makeReq({ username: 'angel', email: 'a@b.com', date_of_birth: '1990-01-01' }), res);
        expect(res.status).toHaveBeenCalledWith(409);
    });

    it('returns 500 on any other Supabase error', async () => {
        mockChain({ data: null, error: { code: 'PGRST', message: 'server error' } });
        const res = makeRes();
        await createUser(makeReq({ username: 'angel', email: 'a@b.com', date_of_birth: '1990-01-01' }), res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('returns 201 with user data on success', async () => {
        const user = { id: '1', username: 'angel', email: 'a@b.com', date_of_birth: '1990-01-01', created_at: '' };
        mockChain({ data: user, error: null });
        const res = makeRes();
        await createUser(makeReq({ username: 'angel', email: 'a@b.com', date_of_birth: '1990-01-01' }), res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(user);
    });
});
