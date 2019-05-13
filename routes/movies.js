const debug = require("debug")("debugger");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const persistence = require("../persistence/moviesPersistence");

router.get("/", async (req, res) => {
  try {
    const movies = await persistence.getMovies();
    res.send(movies);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await persistence.getMovieById(req.params.id);
    res.send(movie);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const movie = await persistence.insertMovie(req.body);
    res.send(movie);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const movie = await persistence.updateMovie(req.params.id, req.body);
    res.send(movie);
  } catch (e) {
    debug(e);
    res.status(400).send(e);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movie = await persistence.deleteMovie(req.params.id);
    res.send(movie);
  } catch (e) {
    res.status(400).send(e);
  }
});

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
