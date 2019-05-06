const debug = require("debug")("debugger");
const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 255,
    trim: true
  },
  genre: new mongoose.Schema({ name: { type: String, required: true } }),
  numberInStock: { type: Number, max: 255, min: 0 },
  dailyRentalRate: { type: Number, max: 255, min: 0 }
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = {
  getMovies: async () => {
    return await Movie.find()
      .select()
      .sort("genre.name");
  },

  getMovieById: async id => {
    return await Movie.findById(id);
  },

  insertMovie: async movieParam => {
    const movie = new Movie(movieParam);
    return await movie.save();
  },

  updateMovie: async (id, movieParam) => {
    const movie = await Movie.findById(id);
    if (movie) {
      movie.title = movieParam.title;
      movie.genre = movieParam.genre;
      movie.numberInStock = movieParam.numberInStock;
      movie.dailyRentalRate = movieParam.dailyRentalRate;
      return await movie.save();
    } else {
      reject();
    }
  },

  deleteMovie: async id => {
    return await Movie.deleteOne({ _id: id });
  },

  Movie
};
