const Controller = require("../controllers");
const checkUser = require("../middlewares/checkUser");

const router = require("express").Router();

router.post("/register", Controller.register);
router.post("/login", Controller.login);
router.get("/users", Controller.getUser);
router.get("/users/:id", Controller.getUserId);
router.patch("/image/:userId", checkUser, Controller.updateImage);
router.patch("/addbalance/:userId", checkUser, Controller.addBalance);
router.patch("/reducebalance/:userId", checkUser, Controller.reducedBalance);
router.get(
  "/histories/balance/:userId",
  checkUser,
  Controller.getHistoryBalance
);
module.exports = router;
