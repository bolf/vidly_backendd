const debug = require("debug")("debugger");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const persistence = require("../persistence/customersPersistence");
const auth = require("../middleware/auth");

router.get("/", async (reg, res) => {
  try {
    const customers = await persistence.getCustomers();
    res.send(customers);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const genre = await persistence.getCustomerById(req.params.id);
    res.send(genre);
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

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const customer = await persistence.updateCustomer({
      _id: req.params.id,
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold
    });
    res.send({
      _id: genre._id,
      name: genre.name,
      phone: customer.phone,
      isGold: customer.isGold
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const customer = await persistence.deleteCustomer(req.params.id);
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
    phone: Joi.string().min(5),
    isGold: Joi.boolean()
  };
  return Joi.validate(customer, schema);
}

module.exports = router;
