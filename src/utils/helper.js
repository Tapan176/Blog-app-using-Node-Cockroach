const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  generateToken: (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return token;
  },
  sendEmail: async (email, emailSubject, emailbody, next) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'tapan.khokhariya109229@marwadiuniversity.ac.in',
          pass: 'Tapan@1701',
        },
      });

      const mailOptions = {
        from: 'tapan.khokhariya109229@marwadiuniversity.ac.in',
        to: email,
        subject: `${emailSubject}`,
        text: `${emailbody}`,
      };

      await transporter.sendMail(mailOptions, (error) => {
        if (error) {
          throw new Error('failed_to_send_email');
        } else {
          return ({ code: 'email_sent_successfully', message: 'Email sent successfully' });
        }
      });
    } catch (error) {
      next(error);
    }
  },
};
