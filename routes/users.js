const express = require("express");
const router = express.Router();
const Joi = require("joi");
const persistence = require("../persistence/usersPersistence");
const debug = require("debug")("debugger");
const _ = require("lodash");

router.get("/", async (req, res) => {
  try {
    const users = await persistence.getUsers();
    res.send(users);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const user = await persistence.insertUser(req.body);
    res.send(_.pick(user, ["_id", "name", "email"]));
  } catch (e) {
    res.status(400).send(e);
  }
});

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(256)
      .required(),
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
