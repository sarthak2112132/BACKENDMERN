const User = require("../models/userModel");
const Order = require("../models/orderModel");
const bcrypt = require("bcryptjs");
const registerController = async (req, res) => {
  try {
    const { name, email, password, address, phone, answer } = req.body;
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(201).send({
        success: false,
        message: "User Already Exists",
      });
    } else {
      const user = await User.create({
        name,
        email,
        password,
        address,
        phone,
        answer,
      });
      res.status(200).send({
        success: true,
        message: "Registered SuccessFully",
        user,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const USER = await User.findOne({ email });
    const userCompare = await bcrypt.compare(password, USER.password);
    if (USER) {
      if (userCompare) {
        res.status(200).send({
          success: true,
          message: "Login SuccessFully",
          token: await USER.generateToken(),
          USER,
        });
      }
    } else {
      res.status(201).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in Login API",
    });
  }
};

const testController = async (req, res) => {
  res.status(200).send({ msg: "Protected Route" });
};

const forgotController = async (req, res) => {
  try {
    const { email, answer, newPassWord } = req.body;
    const user = await User.findOne({ email, answer });
    if (user) {
      const saltValue = await bcrypt.genSalt(10);
      const hassed_Password = await bcrypt.hash(newPassWord, saltValue);
      await User.findByIdAndUpdate(user._id, { password: hassed_Password });
      res.status(200).send({
        success: true,
        message: "Password Reset SuccessFully",
        user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Something Went Wrong",
    });
  }
};
const updateController = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;
    const user = await User.findOne({ email: email });
    if (!password && password.length < 6) {
      res.json({ error: "Password is required and must be 6 characters long" });
    } else {
      const saltValue = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, saltValue);
      const updateUser = await User.findByIdAndUpdate(
        user._id,
        {
          name: name,
          password: hashedPassword,
          phone: phone,
          address: address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated",
        updateUser,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      message: "Error in Updating Profile",
    });
  }
};
const getOrders = async (req, res) => {
  try {
    const { id } = req.body;
    const order = await Order.find({ buyer: id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.status(200).send({
      success: true,
      message: "Ordered Fetched SuccessFully",
      order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting Orders",
    });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const order = await Order.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      order,
      message: "All Orders Fetched SuccessFully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      message: "Error in getting All Orders",
    });
  }
};
module.exports = {
  registerController,
  loginController,
  testController,
  forgotController,
  updateController,
  getOrders,
  getAllOrders,
};
