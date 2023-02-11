const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    enum: [
      "cse",
      "it",
      "ece",
      "eee",
      "mech",
      "mts",
      "auto",
      "chem",
      "food",
      "eni",
      "csd",
      "civil",
      "aiml",
      "aids",
      "mba",
      "other",
    ],
    required: true,
  },
  category: {
    type: String,
    enum: ["auditorium", "halls", "labs"],
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    // required: true
  },
  capacity: {
    type: Number,
    required: true,
  },
  projector: {
    type: Boolean,
    default: false,
    required: true,
  },
  green_room: {
    type: Boolean,
    default: false,
    required: true,
  },
  green_room_count: {
    type: Number,
    required: true,
  },
  system_facility: {
    type: Boolean,
    default: false,
  },
  system_count: {
    type: Number,
    required: true,
  },
  images: {
    type: String,
    // required: true
  },

  incharge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Incharge",
    required: true,
  },
  assistant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Incharge",
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});



const HallModel =  mongoose.model('hall', hallSchema);
module.exports = HallModel