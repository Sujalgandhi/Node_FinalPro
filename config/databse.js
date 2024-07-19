const mongoose = require("mongoose");
const database = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://sujalgandhi0507:sujal1234@cluster0.zijisdn.mongodb.net/blog2"
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = database;
