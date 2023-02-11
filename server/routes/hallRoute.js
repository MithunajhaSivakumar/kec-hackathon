const express = require("express");
const router = express.Router();

const {addHall, updateHall, deleteHall, getOneHall, getHalls, filter, hallCount, hallCapacity } = require("../controllers/hallController")
const { checkIfAdmin } = require("../middlewares/authMiddleware");

//route level middleware - protects route
router.use("/addHall", checkIfAdmin);
router.use("/updateHall/:code", checkIfAdmin);
router.use("/deleteHall/:code", checkIfAdmin)
router.use("/hallCount", checkIfAdmin)

//public routes
router.get("/getOneHall/:code", getOneHall)
router.get("/getHalls", getHalls)
// router.post("/filter", filter);
router.get("/hallCount", hallCount)
router.get("/hallCapacity", hallCapacity);

//protected routes
router.post("/addHall", addHall);
router.patch("/updateHall/:code", updateHall);
router.delete("/deleteHall/:code", deleteHall)

module.exports = router;