const express = require("express");
const router = express.Router();
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleWare");
const { RequireSignIn, isADMIN } = require("../middlewares/authMiddleWare2");
const {
  categoryController,
  updateCategoryController,
  getCategoryController,
  singleCategoryController,
  deleteController,
} = require("../controllers/categoryController");
router.route("/create-category").post(categoryController);
router.route("/update-category/:id").post(updateCategoryController);
router.route("/get-category").get(getCategoryController);
router.route("/single-category/:id").get(singleCategoryController);
router.route("/delete-category/:id").delete(deleteController);
module.exports = router;
