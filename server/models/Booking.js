const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hall_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hall",
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
      "aiml",
      "aids",
      "mba",
      "other",
    ],
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  staff: {
    type: String,
    required: true,
  },
  staff_phone: {
    type: String,
    required: true,
  },
  staff_email: {
    type: String,
    required: true,
  },
  conductBy: {
    type: String,
    enum: ["club", "placements", "review", "association", "others"],
    required: true,
  },
  event_name: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["approved", "rejected"],
    default: "approved",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const BookingModel =  mongoose.model('booking', bookingSchema);
module.exports = BookingModel