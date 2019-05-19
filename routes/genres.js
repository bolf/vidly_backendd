const debug = require("debug")("debugger");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const persistence = require("../persistence/genresPersistence");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  try {
    const genres = await persistence.getGenres();
    res.send(genres);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await persistence.getGenreById(req.params.id);
    res.send(genre);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const genre = await persistence.insertGenre(req.body.name);
    res.send({ _id: genre._id, name: genre.name });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const genre = await persistence.updateGenre(req.params.id, req.body.name);
    res.send({ _id: genre._id, name: genre.name });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const genre = await persistence.deleteGenre(req.params.id);
    res.send({ _id: genre._id, name: genre.name });
  } catch (e) {
    res.status(400).send(e);
  }
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(genre, schema);
}

module.exports = router;
