const router = require("express").Router();
const PostController = require("@controllers/PostController");
// const createPostMiddleWare = require("../middleware/createPost");
const verifyAuthToken = require('@middlewares/security/verifyAuthToken');

router
  .route("/")
  .post([verifyAuthToken], PostController.createPost);


router
  .route("/create-post-davaleba")
  .post([verifyAuthToken], PostController.createPostDavaleba);



module.exports = router;