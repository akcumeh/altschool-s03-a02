import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendBirthdayEmail(to: string, username: string): Promise<void> {
    await transporter.sendMail({
        from: `"Birthday Reminder" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Happy Birthday, ${username}!`,
        html: `
            <h1>Happy Birthday, ${username}!</h1>
            <p>I wish you a most wonderful day filled with joy and celebration.</p>
        `,
    });

    console.log(`Birthday email sent to ${to}`);
}
