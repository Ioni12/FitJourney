const express = require("express");
const { createUser, signInUser } = require("../controllers/userController");

const router = express.Router();

router.post("/create", createUser);
router.post("/signin", signInUser);

module.exports = router;
