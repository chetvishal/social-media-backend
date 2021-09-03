const express = require("express");
const { searchUser } = require("../controllers/search.controller");
const router = express.Router();
const { AuthVerification } = require("../middlewares/AuthVerification");

router.route("/")
    .get(searchUser);

module.exports = router;