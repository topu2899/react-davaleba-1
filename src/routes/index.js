const router = require("express").Router();
const categoryRouter = require("./CategoryRouter");
const userRouter = require("./UserRouter");
const postRouter = require("./PostRouter");

router.use("/category", categoryRouter);
router.use("/user", userRouter);
router.use("/post", postRouter);
module.exports = router;
