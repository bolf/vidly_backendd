const mongoose = require("mongoose");
const debug = require("debug")("debugger");
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Genre = mongoose.model("Genre", genreSchema);

module.exports = {
  getGenres: async () => {
    return await Genre.find()
      .select("name")
      .sort("name");
  },

  getGenreById: async id => {
    return await Genre.findById(id).select("name");
  },

  insertGenre: async name => {
    const genre = new Genre({ name: name });
    return await genre.save();
  },

  updateGenre: async (id, name) => {
    const genre = await Genre.findById(id);
    if (genre) {
      genre.name = name;
      return await genre.save();
    } else {
      reject();
    }
  },

  deleteGenre: async id => {
    return await Genre.deleteOne({ _id: id });
  }
};
