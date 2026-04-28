import cron from 'node-cron';
import { checkBirthdays } from '../services/birthdayChecker';

export function startScheduler(): void {
    cron.schedule('0 7 * * *', async () => {
        console.log('Running daily birthday check...');
        await checkBirthdays();
    });

    console.log('Birthday scheduler started. Runs daily at 07:00.');
}
