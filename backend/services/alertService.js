const nodemailer = require("nodemailer");

const sendAlert = async (userId, message, score) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "🚨 High Risk Student Alert",
    text: `
User ID: ${userId}
Message: ${message}
Negative Score: ${score}
Time: ${new Date()}
    `,
  });
};

module.exports = sendAlert;