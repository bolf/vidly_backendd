const mongoose = require("mongoose");
const debug = require("debug")("debugger");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchemema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 5,
    max: 256
  },
  email: {
    type: String,
    required: true,
    min: 5,
    max: 256
  },
  password: {
    type: String,
    required: true,
    min: 5,
    max: 1024
  }
});

userSchemema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
};

const User = mongoose.model("User", userSchemema);

module.exports = {
  insertUser: async userParam => {
    const existingUser = await User.findOne({ email: userParam.email });
    if (existingUser) {
      throw "user with this email is registered already";
    }

    const user = new User(userParam);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(userParam.password, salt);
    return await user.save();
  },

  getUserByEmail: async email => {
    const user = await User.findOne({ email: email });
    return user;
  },

  getUsers: async () => {
    return await User.find().sort("name");
  }
};
