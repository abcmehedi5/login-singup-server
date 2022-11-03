const mongoose = require("mongoose");
const SingupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 20,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email Address is required",
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
  },
  img: {
    
  }
 
});

// user model
const user = new mongoose.model("user", SingupSchema); // user name collection create to mongodb database
module.exports = user;
