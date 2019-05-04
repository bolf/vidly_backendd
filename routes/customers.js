const debug = require("debug")("debugger");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const persistence = require("../persistence/customerPersistence");

router.get("/", async (reg, res) => {
  try {
    const customers = await persistence.getCustomers();
    res.send(customers);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const customer = await persistence.insertCustomer({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold
    });
    res.send({
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required(),
    phone: Joi.string().min(5)
  };
  return Joi.validate(customer, schema);
}

module.exports = router;
