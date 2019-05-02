const express = require("express");
const router = express.Router();
const Joi = require("joi");
const persistence = require("../persistence");

const loc_genres = persistence.getGenres();

router.get("/", (req, res) => {
  res.send(loc_genres);
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const genre = persistence.getGenreById(loc_genres, id);
  if (genre) {
    res.send(genre);
  } else {
    res.status(404).send("genre with given id was not found");
  }
});

router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = {
    id: loc_genres.length + 1,
    name: req.body.name
  };

  loc_genres.push(genre);
  res.send(genre);
});

router.put("/:id", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const id = parseInt(req.params.id);
  const genre = persistence.getGenreById(loc_genres, id);
  if (genre) {
    genre.name = req.body.name;
    res.send(genre);
  } else {
    res.status(404).send("genre with given id was not found");
  }
});

router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const genre = persistence.getGenreById(loc_genres, id);
  if (genre) {
    const id = loc_genres.indexOf(genre);
    loc_genres.splice(id, 1);
    res.send(genre);
  } else {
    res.status(404).send("genre with given id was not found");
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
