const express = require("express");
const { getUserNotifications } = require("../controllers/notification.controller");
const router = express.Router();
const { AuthVerification } = require("../middlewares/AuthVerification");

router.route("/:userId")
    .get(getUserNotifications);

module.exports = router;