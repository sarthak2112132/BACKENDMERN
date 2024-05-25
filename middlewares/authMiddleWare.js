const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const requireSignIn = async (req, res, next) => {
  try {
    const decode = jwt.verify(req.headers.authorization, process.env.JWT_KEY);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role != 1) {
      res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Admin MiddleWare",
    });
  }
};
module.exports = {
  requireSignIn,
  isAdmin,
};
