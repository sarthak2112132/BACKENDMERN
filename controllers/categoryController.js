const Category = require("../models/categoryModel");
const slugify = require("slugify");
const slug = require("slug");
const categoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      res.status(201).send({
        success: false,
        message: "Category Already Exists",
      });
    } else {
      const category = await Category.create({ name, slug: slugify(name) });
      res.status(200).send({
        success: true,
        message: "Category Created",
        category,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Category",
    });
  }
};

const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, {
      name,
    });
    res.status(200).send({
      success: true,
      message: "Category Updated",
      category,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      message: "Error in Update Api",
    });
  }
};
const getCategoryController = async (req, res) => {
  try {
    const category = await Category.find({});
    res.status(200).send({
      success: true,
      message: "Category List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Get Category",
    });
  }
};
const singleCategoryController = async (req, res) => {
  try {
    const category = await Category.findOne({ id: req.params.id });
    res.status(200).send({
      success: true,
      message: "Single  Category Fetched",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in The Single Category Api",
    });
  }
};
const deleteController = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Deleted SuccessFully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Delete Api ",
    });
  }
};
module.exports = {
  categoryController,
  updateCategoryController,
  getCategoryController,
  singleCategoryController,
  deleteController,
};
