const debug = require("debug")("debugger");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const persistence = require("../persistence/moviesPersistence");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const movies = await persistence.getMovies();
    res.send(movies);
  })
);

router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const movie = await persistence.getMovieById(req.params.id);
    res.send(movie);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const movie = await persistence.insertMovie(req.body);
    res.send(movie);
  })
);

router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const movie = await persistence.updateMovie(req.params.id, req.body);
    res.send(movie);
  })
);

router.delete(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const movie = await persistence.deleteMovie(req.params.id);
    res.send(movie);
  })
);

function validateMovie(movie) {
  const genreSchema = Joi.object().keys({
    name: Joi.string()
      .min(3)
      .required()
  });
  const schema = {
    title: Joi.string().required(),
    genre: genreSchema,
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number()
  };
  return Joi.validate(movie, schema);
}

module.exports = router;
