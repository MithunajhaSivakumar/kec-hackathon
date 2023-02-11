const express = require("express");
const { bookOneHall, bookingCount, allBookings } = require("../controllers/bookingController");
const router = express.Router();

const { checkIfAdmin, checkUserAuth } = require("../middlewares/authMiddleware");

router.use("/bookHall/:code", checkUserAuth);
router.use("/bookingCount", checkIfAdmin)
router.use("/allBookings", checkIfAdmin)

router.post("/bookHall/:code", bookOneHall);

router.get("/bookingCount", bookingCount)
router.get("/allBookings", allBookings)
module.exports = router;