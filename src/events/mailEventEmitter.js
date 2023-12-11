const EventEmitter = require('events');
const { sendSingleMail } = require("@utils/mailUtils");

class MailEventEmitter extends EventEmitter { }
const mailEventEmitter = new MailEventEmitter();
mailEventEmitter.on('sendSingleMail', async (mailSettings) => {
  await sendSingleMail(mailSettings);
});
module.exports = mailEventEmitter;
