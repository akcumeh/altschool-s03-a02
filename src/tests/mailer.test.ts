const mockSendMail = jest.fn().mockResolvedValue({});

jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => ({ sendMail: mockSendMail })),
}));

import { sendBirthdayEmail } from '../services/mailer';

describe('sendBirthdayEmail', () => {
    beforeEach(() => mockSendMail.mockClear());

    it('calls sendMail with the correct to, subject, and from fields', async () => {
        await sendBirthdayEmail('to@example.com', 'Angel');
        expect(mockSendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: 'to@example.com',
                subject: 'Happy Birthday, Angel!',
                from: expect.stringContaining('Birthday Reminder'),
            })
        );
    });
});
