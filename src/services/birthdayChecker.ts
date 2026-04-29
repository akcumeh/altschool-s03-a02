import { supabase } from '../db';
import { sendBirthdayEmail } from './mailer';

export async function checkBirthdays(): Promise<void> {
    const today = new Date();
    const monthStr = String(today.getUTCMonth() + 1).padStart(2, '0');
    const dayStr   = String(today.getUTCDate()).padStart(2, '0');

    const { data, error } = await supabase
        .from('users')
        .select('id, username, email, date_of_birth');

    if (error) {
        console.error('Birthday check failed:', error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.log('No users registered yet.');
        return;
    }

    const todaysBirthdays = data.filter((user) => {
        const dob = new Date(user.date_of_birth);
        return dob.getUTCMonth() + 1 === today.getUTCMonth() + 1
            && dob.getUTCDate() === today.getUTCDate();
    });

    if (todaysBirthdays.length === 0) {
        console.log('No birthdays today.');
        return;
    }

    for (const user of todaysBirthdays) {
        await sendBirthdayEmail(user.email, user.username);
    }
}
