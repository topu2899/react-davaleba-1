const router = require("express").Router();
const CategoryController = require("@controllers/CategoryController");
const createCategoryMiddleware = require("@middlewares/createCategory");
const verifyAuthToken = require('@middlewares/security/verifyAuthToken');

router
  .route("/")
  .get()
  .post([verifyAuthToken, createCategoryMiddleware], CategoryController.createCategory);

module.exports = router;
