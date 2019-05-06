const debug = require("debug")("debugger");
const mongoose = require("mongoose");
const Fawn = require("fawn");

Fawn.init(mongoose);

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      isGold: { type: Boolean, default: false },
      phone: { type: String, required: true }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      dailyRentalRate: { type: Number, max: 255, min: 0, required: true }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

const Rental = mongoose.model("Rental", rentalSchema);

module.exports = {
  getRentals: async () => {
    return Rental.find();
  },

  insertRental: (rentalParam, movie) => {
    new Fawn.Task()
      .save("rentals", rentalParam)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 }
        }
      )
      .run();

    return rentalParam;
  },
  Rental
};
