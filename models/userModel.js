const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "0",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (!user.isModified("password")) {
      next();
    }
    const saltValue = await bcrypt.genSalt(10);
    const Hasshed_password = await bcrypt.hash(user.password, saltValue);
    user.password = Hasshed_password;
  } catch (error) {
    next(error);
  }
});

userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1d",
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
