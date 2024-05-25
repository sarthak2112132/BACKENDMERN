const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleWare");
const {
  createProductController,
  getAllProductsController,
  getSingleProductController,
  photoController,
  updateController,
  deleteController,
  productFilterController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  productCategoryController,
  braintreeController,
  braintreePaymentController,
} = require("../controllers/productController");
const formidable = require("express-formidable");
const router = express.Router();
router.route("/create-product").post(formidable(), createProductController);
router.route("/get-product").get(getAllProductsController);
router.route("/get-product/:slug").get(getSingleProductController);
router.route("/product-photo/:slug").get(photoController);
router.route("/update-product/:pid").put(formidable(), updateController);
router.route("/delete-product/:pid").delete(deleteController);
router.route("/product-filters").post(productFilterController);
router.route("/product-count").get(productCountController);
router.route("/product-list/:page").get(productListController);
router.route("/search/:keyword").get(searchProductController);
router.route("/related-product/:pid/:cid").get(relatedProductController);
router.route("/product-category/:slug").get(productCategoryController);
//token for braintree
router.route("/braintree/token").get(braintreeController);
//payment
router.route("/braintree/payment").post(braintreePaymentController);
module.exports = router;
