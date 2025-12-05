const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    make: String,
    model: String,
    color: String,
    year: Number,
    type: String,
    isReadyToUse: Boolean,
  });

const Car = mongoose.model("Car", carSchema); // create model

module.exports = Car;