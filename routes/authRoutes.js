const express = require("express");
const {
  registerController,
  loginController,
  testController,
  forgotController,
  updateController,
  getOrders,
  getAllOrders,
} = require("../controllers/authController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleWare");
const router = express.Router();
router.route("/register").post(registerController);
router.route("/login").post(loginController);
router.route("/forgot-password").post(forgotController);
router.route("/test").get(requireSignIn, isAdmin, testController);
router.route("/user-auth").get(requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.route("/admin-auth").get(requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
router.route("/profile").put(updateController);
router.route("/orders").post(getOrders);
router.route("/all-orders").get(getAllOrders);
module.exports = router;
