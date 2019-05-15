const express = require("express");
const router = express.Router();
const Joi = require("joi");
const persistence = require("../persistence/usersPersistence");
const debug = require("debug")("debugger");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const user = await persistence.getUserByEmail(req.body.email);
    if (!user) {
      return res.status(400).send("invalid email or password");
    }
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.status(400).send("invalid email or password");
    }

    const token = jwt.sign({ _id: user._id }, "privateKey");
    res.send(token);
  } catch (e) {
    res.status(400).send(e);
  }
});

function validateUser(user) {
  const schema = {
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(256)
      .required()
  };

  return Joi.validate(user, schema);
}

module.exports = router;
