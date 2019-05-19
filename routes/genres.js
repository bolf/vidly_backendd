const debug = require("debug")("debugger");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const persistence = require("../persistence/genresPersistence");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");

router.get(
  "/",
  asyncMiddleware(async (req, res, next) => {
    const genres = await persistence.getGenres();
    res.send(genres);
  })
);

router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const genre = await persistence.getGenreById(req.params.id);
    res.send(genre);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const genre = await persistence.insertGenre(req.body.name);
    res.send({ _id: genre._id, name: genre.name });
  })
);

router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const genre = await persistence.updateGenre(req.params.id, req.body.name);
    res.send({ _id: genre._id, name: genre.name });
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const genre = await persistence.deleteGenre(req.params.id);
    res.send({ _id: genre._id, name: genre.name });
  })
);

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(genre, schema);
}

module.exports = router;
