const transporter = require("@config/transporter");

const sendSingleMail = async (mailSettings) => {
  const { to, subject, template } = mailSettings;
  const mailOptions = {
    from: 'BLOG API',
    to,
    subject,
    html: template,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendSingleMail };