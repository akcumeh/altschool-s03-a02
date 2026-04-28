import { supabase } from '../db';
import { sendBirthdayEmail } from './mailer';
import { User } from '../models/User';

export async function checkBirthdays(): Promise<void> {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const { data, error } = await supabase.from('users').select('*');

    if (error) {
        console.error('Birthday check failed:', error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.log('No users registered yet.');
        return;
    }

    const todaysBirthdays = (data as User[]).filter((user) => {
        const dob = new Date(user.date_of_birth);
        return dob.getUTCMonth() + 1 === month && dob.getUTCDate() === day;
    });

    if (todaysBirthdays.length === 0) {
        console.log('No birthdays today.');
        return;
    }

    for (const user of todaysBirthdays) {
        await sendBirthdayEmail(user.email, user.username);
    }
}
