const Product = require("../models/productModel");
const fs = require("fs");
const Order = require("../models/orderModel");
const slugify = require("slugify");
const Category = require("../models/categoryModel");
const braintree = require("braintree");
const dotenv = require("dotenv");
dotenv.config();
//payment Gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANR_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ message: "Name is required" });
      case !description:
        return res.status(500).send({ message: "Description  is required" });
      case !price:
        return res.status(500).send({ message: "Price is required" });
      case !category:
        return res.status(500).send({ message: "Category is required" });
      case !quantity:
        return res.status(500).send({ message: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ message: "Photo is required and must be less than 1mb" });
    }
    const products = new Product({
      ...req.fields,
      slug: slugify(name),
    });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Product Created SuccessFully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Creating Product",
    });
  }
};
const getAllProductsController = async (req, res) => {
  try {
    const Products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      totalCount: Products.length,
      message: "All Products",
      Products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in product Api",
    });
  }
};
const getSingleProductController = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Cannot Get Single Product",
    });
  }
};
const photoController = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).select(
      "photo"
    );
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting Photo",
    });
  }
};
const updateController = async (req, res) => {
  try {
    const { name, description, slug, price, quantity, category, shipping } =
      req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ msg: "Name is required required" });
      case !description:
        return res.status(500).send({ msg: "Description is not required" });
      case !category:
        return res.status(500).send({ msg: "Category is not required" });
      case !quantity:
        return res.status(500).send({ msg: "Quantity is not required" });
      case !price:
        return res.status(500).send({ msg: "Price is not required" });
    }
    const products = await Product.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Updated SuccessFully",
      products,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      sucess: false,
      message: "Error in Updation",
    });
  }
};
const deleteController = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.pid);
    res.status(200).send({
      success: true,
      message: "Product Deleted SuccessFully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      message: "Error in delete API",
    });
  }
};
const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await Product.find(args);
    res.status(200).send({
      success: true,
      message: "Filtered SuccessFully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Filtering",
    });
  }
};
const productCountController = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      message: "Count Displayed SuccessFully",
      total,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in the Product Count Api",
    });
  }
};
const productListController = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const Products = await Product.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage);
    res.status(200).send({
      success: true,
      message: "Pagination Done SuccessFully",
      Products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in List Controller",
    });
  }
};
const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    res.status(200).send({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Searching By Keyword",
    });
  }
};
const relatedProductController = async (req, res) => {
  const { pid, cid } = req.params;
  try {
    const products = await Product.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      status: true,
      message: "Related Products Fetched",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
    });
  }
};
const productCategoryController = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    const products = await Product.find({ category }).populate("category");
    res.status(200).send({
      message: "Product Category Fetched ",
      success: true,
      category,
      products,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error In the ProductCategoryController",
      success: false,
    });
  }
};
const braintreeController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce, id } = req.body;
    let total = 0;
    cart.map((i) => (total += i.price));
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new Order({
            products: cart,
            payment: result,
            buyer: id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
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
};
