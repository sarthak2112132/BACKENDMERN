const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./utils/db");
const authRouter = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const path = require("path");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use(express.static(path.join(__dirname, "./client/build")));

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
// connection
connectDb();
const PORT = process.env.PORT;
const DEV = process.env.DEV_MODE;
app.listen(PORT, () => {
  console.log(
    `Server is Running at the ${PORT} port  in ${DEV} mode `.bgCyan.white
  );
});
