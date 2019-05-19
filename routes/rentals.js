const debug = require("debug")("debugger");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const persistence = require("../persistence/rentalsPersistence");
const { Customer } = require("../persistence/customersPersistence");
const { Movie } = require("../persistence/moviesPersistence");
const { Rental } = require("../persistence/rentalsPersistence");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const rentals = await persistence.getRentals();
    res.send(rentals);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("invalid customer id");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("invalid movie id");

    if (movie.numberInStock === 0)
      return res.status(400).send("not enough in stock");

    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      }
    });
    rental = persistence.insertRental(rental, movie);
    res.send(rental);
  })
);

function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };
  return Joi.validate(rental, schema);
}

module.exports = router;
