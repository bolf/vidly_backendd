const debug = require("debug")("debugger");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const persistence = require("../persistence/customersPersistence");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const _ = require("lodash");

router.get(
  "/",
  asyncMiddleware(async (reg, res) => {
    const customers = await persistence.getCustomers();
    res.send(customers);
  })
);

router.get(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const genre = await persistence.getCustomerById(req.params.id);
    res.send(genre);
  })
);

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const customer = await persistence.insertCustomer(
      _.pick(req.body, ["name", "phone", "isGold"])
    );
    res.send(_.pick(customer, ["_id", "name", "phone", "isGold"]));
  })
);

router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
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
  })
);

router.delete(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const customer = await persistence.deleteCustomer(req.params.id);
    res.send({
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold
    });
  })
);

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
