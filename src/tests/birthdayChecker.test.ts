import { checkBirthdays } from '../services/birthdayChecker';
import { supabase } from '../db';
import { sendBirthdayEmail } from '../services/mailer';

jest.mock('../db', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

jest.mock('../services/mailer', () => ({
    sendBirthdayEmail: jest.fn().mockResolvedValue(undefined),
}));

const mockFrom = supabase.from as jest.Mock;
const mockSendEmail = sendBirthdayEmail as jest.Mock;

function mockChain(result: { data: unknown; error: unknown }) {
    const chain = {
        select: jest.fn().mockReturnThis(),
        like: jest.fn().mockResolvedValue(result),
    };
    mockFrom.mockReturnValue(chain);
}

describe('checkBirthdays', () => {
    beforeEach(() => jest.clearAllMocks());

    it('does not send email when Supabase returns an error', async () => {
        mockChain({ data: null, error: { message: 'db error' } });
        await checkBirthdays();
        expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it('does not send email when no birthdays match today', async () => {
        mockChain({ data: [], error: null });
        await checkBirthdays();
        expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it('sends one email when one user has a birthday today', async () => {
        mockChain({ data: [{ id: '1', username: 'angel', email: 'angel@example.com' }], error: null });
        await checkBirthdays();
        expect(mockSendEmail).toHaveBeenCalledTimes(1);
        expect(mockSendEmail).toHaveBeenCalledWith('angel@example.com', 'angel');
    });

    it('sends two emails when two users have birthdays today', async () => {
        mockChain({
            data: [
                { id: '1', username: 'angel', email: 'angel@example.com' },
                { id: '2', username: 'ben', email: 'ben@example.com' },
            ],
            error: null,
        });
        await checkBirthdays();
        expect(mockSendEmail).toHaveBeenCalledTimes(2);
    });
});
