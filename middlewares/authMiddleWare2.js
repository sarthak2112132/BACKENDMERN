const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const RequireSignIn = async (req, res, next) => {
  try {
    const decode = jwt.verify(req.headers.authorization, process.env.JWT_KEY);
    req.uSer = decode;
    next();
  } catch (error) {
    console.log(error.message);
  }
};

const isADMIN = async (req, res, next) => {
  try {
    const user = await User.findOne(req.uSer.userId);
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
  RequireSignIn,
  isADMIN,
};
