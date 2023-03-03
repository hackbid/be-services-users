
const Controller = require("../controllers/index");
const ControllerUpdate = require('../controllers/updateData')
const checkUser = require("../middlewares/checkUser");

const router = require("express").Router();



router.post("/register", Controller.register);
router.post("/login", Controller.login);
router.get("/users", Controller.getUser);
router.get("/users/:id", Controller.getUserId);

router.patch("/image/:userId",checkUser,ControllerUpdate.updateImage);

router.patch("/addbalance/:userId",checkUser, ControllerUpdate.addBalance);
router.patch("/reducebalance/:userId",checkUser, ControllerUpdate.reducedBalance);
router.get(
  "/histories/balance/:userId",checkUser,Controller.getHistoryBalance
);
module.exports = router;
