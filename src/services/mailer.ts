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
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background-color:#060930;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#060930;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#333456;border-radius:20px;overflow:hidden;">

          <!-- Header band -->
          <tr>
            <td style="background-color:#595B83;padding:32px 40px;text-align:center;">
              <div style="font-size:48px;margin-bottom:8px;">🎂</div>
              <span style="display:inline-block;background-color:rgba(244,171,196,0.2);color:#F4ABC4;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:4px 14px;border-radius:999px;">Birthday Reminder</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#ffffff;line-height:1.2;">
                Happy Birthday, <span style="color:#F4ABC4;">${username}!</span>
              </h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.55);">
                I wish you a most wonderful day filled with joy and celebration. May this year bring you everything you've been hoping for.
              </p>
              <div style="border-top:1px solid rgba(89,91,131,0.5);padding-top:20px;">
                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.3);text-align:center;">
                  You're receiving this because you registered with Birthday Reminder.
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    console.log(`Birthday email sent to ${to}`);
}
