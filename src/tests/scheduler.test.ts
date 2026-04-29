import cron from 'node-cron';
import { checkBirthdays } from '../services/birthdayChecker';
import { startScheduler } from '../cron/scheduler';

jest.mock('node-cron', () => ({
    schedule: jest.fn(),
}));

jest.mock('../services/birthdayChecker', () => ({
    checkBirthdays: jest.fn().mockResolvedValue(undefined),
}));

const mockSchedule = cron.schedule as jest.Mock;
const mockCheckBirthdays = checkBirthdays as jest.Mock;

describe('startScheduler', () => {
    beforeEach(() => jest.clearAllMocks());

    it('calls cron.schedule with the provided expression', () => {
        startScheduler('*/1 * * * *');
        expect(mockSchedule).toHaveBeenCalledWith('*/1 * * * *', expect.any(Function));
    });

    it('the cron callback invokes checkBirthdays', async () => {
        startScheduler('*/1 * * * *');
        const callback = mockSchedule.mock.calls[0][1];
        await callback();
        expect(mockCheckBirthdays).toHaveBeenCalled();
    });
});
