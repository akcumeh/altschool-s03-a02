import cron from 'node-cron';
import { checkBirthdays } from '../services/birthdayChecker';

export function startScheduler(expression = '0 7 * * *'): void {
    cron.schedule(expression, async () => {
        console.log('Running daily birthday check...');
        await checkBirthdays();
    });

    console.log('Birthday scheduler started. Runs daily at 07:00.');
}
