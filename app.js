const Joi = require("joi");
const express = require("express");
const persistence = require("./persistence");

const app = express();
app.use(express.json());

const loc_genres = persistence.getGenres();

app.get("/api/genres", (req, res) => {
  res.send(loc_genres);
});

app.get("/api/genres/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const genre = persistence.getGenreById(loc_genres, id);
  if (genre) {
    res.send(genre);
  } else {
    res.status(404).send("genre with given id was not found");
  }
});

app.post("/api/genres", (req, res) => {
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

app.put("/api/genres/:id", (req, res) => {
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

app.delete("/api/genres/:id", (req, res) => {
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening ${port}`);
});
