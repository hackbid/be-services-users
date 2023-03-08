const Controller = require("../controllers/index");
const ControllerUpdate = require("../controllers/updateData");
const checkUser = require("../middlewares/checkUser");

const router = require("express").Router();

router.post("/register", Controller.register);
router.post("/login", Controller.login);
router.get("/users", Controller.getUser);
router.get("/users/:id", Controller.getUserId);

router.patch("/image/:userId", checkUser, ControllerUpdate.updateImage);
router.post("/payment/:userId", checkUser,ControllerUpdate.payment);
router.patch("/addbalance/:userId", checkUser, ControllerUpdate.addBalance);

router.patch(
  "/reducebalance/:userId",
  checkUser,
  ControllerUpdate.reducedBalance
);
//--------Repoting withdraw
router.get("/reportwd", ControllerUpdate.getReportWD);
router.post("/reportwd/:userId", checkUser, ControllerUpdate.reportWD);
router.patch("/approve/:id", ControllerUpdate.approveWD);
router.patch("/reportwd/:id", ControllerUpdate.rejectWD);
//--------Repoting withdraw

router.get(
  "/histories/balance/:userId",
  checkUser,
  Controller.getHistoryBalance
);
module.exports = router;
