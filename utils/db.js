const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MDATABASE_URI);
    console.log(
      `Database is connected at ${mongoose.connection.host} successfully`
        .bgGreen.white
    );
  } catch (error) {
    console.log(`Mongoose Error `.bgRed.white);
  }
};

module.exports = connectDb;
