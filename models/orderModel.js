const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "products",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delieverd", "Cancel"],
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("orders", orderSchema);

module.exports = orderModel;
