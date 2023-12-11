const router = require("express").Router();
const UserController = require("@controllers/UserController");
const validateRegister = require("@middlewares/validateRegister");
const verifyActivationToken = require("@middlewares/security/verifyActivationToken");
const verifyNewPassToken = require("@middlewares/security/verifyNewPassToken");

router.post("/login", UserController.login);
router.post("/registration", [validateRegister], UserController.registration);
router.patch("/activate", [verifyActivationToken], UserController.activate);
router.patch("/forgotPassword", UserController.forgotPassword);
router.patch("/resetPassword", [verifyNewPassToken], UserController.resetPassword);

module.exports = router;