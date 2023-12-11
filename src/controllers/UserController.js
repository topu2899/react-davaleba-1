const { default: mongoose } = require("mongoose");
const CONN = mongoose.connection;
const bcrypt = require("bcrypt");
const path = require('path');
const ejs = require("ejs");
const User = require("@models/User");
const messages = require('@constants/messages');
const { getDuplicateFieldMessage, getNotFoundMessage } = require('@utils/messageUtils');
const mailEventEmitter = require("@events/mailEventEmitter");
const { generateToken } = require("@utils/securityUtils");

exports.registration = async (req, res) => {
  const session = await CONN.startSession();
  try {
    session.startTransaction();

    const encryptedPassword = bcrypt.hashSync(
      req.body.password,
      Number(process.env.SALT)
    );

    await User.create(
      [
        {
          ...req.body,
          password: encryptedPassword,
        }],
      { session }
    );

    const activationToken = generateToken({ nickName: req.body.nickName, email: req.body.email, type: "activation" }, "1h");
    const activationLink = `http://${process.env.APP_HOST}:${process.env.APP_PORT}/user/activate/${activationToken}`;
    const templateData = { name: req.body.name, activationLink };
    const emailTemplate = await ejs.renderFile(path.resolve(__dirname, '..', 'templates', 'register-template.ejs'), templateData);
    const mailSettings = { to: req.body.email, subject: "Activate account", template: emailTemplate };

    mailEventEmitter.emit('sendSingleMail', mailSettings, res);

    await session.commitTransaction();
    return res.send(messages.SUCCESSFULL_REGISTRATION);
  } catch (error) {
    await session.abortTransaction();
    if (error.code === 11000) {
      return res.status(400).send(getDuplicateFieldMessage("User", error.keyPattern))
    }
    return res.status(400).send(messages.UNCATEGORIZED_ERROR);
  }
  finally {
    session.endSession();
  }
};

exports.login = async (req, res) => {
  let foundUser;
  let passwordsMatch;

  if (!req.body.email || !req.body.password) {
    return res.status(400).send(messages.ALL_FIELDS_REQUIRED);
  }
  try {
    foundUser = await User.findOne({ email: req.body.email });
  }
  catch (_) {
    return res.status(400).send(messages.UNCATEGORIZED_ERROR);
  }

  if (!foundUser)
    return res.status(401).send(messages.INVALID_CREDENTIALS);

  if (foundUser.blocked)
    return res.status(403).send(messages.ACCOUNT_BLOCKED);

  try {
    passwordsMatch = await bcrypt.compare(req.body.password, foundUser.password);
  }
  catch (_) {
    return res.status(400).send(messages.UNCATEGORIZED_ERROR);
  }

  if (passwordsMatch) {
    const token = generateToken({
      id: foundUser.id,
      nickName: foundUser.nickName || null,
      role: foundUser.role,
      email: foundUser.email,
      type: "auth"
    }, "24h");

    foundUser.lastLogin = Date.now();
    await foundUser.save();
    return res.send({ token });
  }

  return res.status(401).send(messages.INVALID_CREDENTIALS);
};

exports.activate = async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.activationData.email });

    if (!foundUser)
      return res.status(404).send(getNotFoundMessage("User"));

    if (foundUser.blocked)
      return res.status(403).send(messages.ACCOUNT_BLOCKED);

    if (foundUser.active) return res.status(400).send(messages.ACCOUNT_ACTIVATED);

    foundUser.active = true;
    await foundUser.save();

    delete req.activationData;

    return res.send(messages.SUCCESSFULL_ACTIVATION);
  }
  catch (_) {
    return res.status(400).send(messages.UNCATEGORIZED_ERROR);
  }
}

exports.forgotPassword = async (req, res) => {
  try {

    const foundUser = await User.findOne({ email: req.body.email });

    if (!foundUser)
      return res.status(404).send(getNotFoundMessage("User"));

    if (foundUser.blocked)
      return res.status(403).send(messages.ACCOUNT_BLOCKED);

    const activationToken = generateToken({ id: foundUser._id, email: foundUser.email, type: "newPass" }, "1h");
    const activationLink = `http://${process.env.APP_HOST}:${process.env.APP_PORT}/user/resetPassword/${activationToken}`;
    const templateData = { name: foundUser.name, activationLink };
    const emailTemplate = await ejs.renderFile(path.resolve(__dirname, '..', 'templates', 'newPass-template.ejs'), templateData);
    const mailSettings = { to: foundUser.email, subject: "Set new password", template: emailTemplate };

    mailEventEmitter.emit('sendSingleMail', mailSettings);
    return res.send(messages.RESET_PASSWORD);
  }
  catch (_) {
    return res.status(400).send(messages.UNCATEGORIZED_ERROR);
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.newPassData.email });

    if (!foundUser)
      return res.status(404).send(getNotFoundMessage("User"));

    if (foundUser.blocked)
      return res.status(403).send(messages.ACCOUNT_BLOCKED);

    const encryptedPassword = bcrypt.hashSync(
      req.body.password,
      Number(process.env.SALT)
    );

    foundUser.password = encryptedPassword;
    await foundUser.save();

    delete req.newPassData;

    return res.send(messages.NEW_PASSWORD);
  }
  catch (_) {
    return res.status(400).send(messages.UNCATEGORIZED_ERROR);
  }
}