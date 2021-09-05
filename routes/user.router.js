const express = require("express");
const {
    getUserDetails,
    updateUserDetails,
    getFollowLists,
    followUser,
    unFollowUser,
    getUserDetailsByUsername,
    uploadProfilePic
} = require("../controllers/user.controller");
const router = express.Router();
const { AuthVerification } = require("../middlewares/AuthVerification");

router.use(AuthVerification)
router.route("/")
    .get(getUserDetails)
    .post(updateUserDetails)

router.route('/:username')
    .get(getUserDetailsByUsername)

router.route("/:userId/followlist")
    .get(getFollowLists);

router.route("/user/follow")
    .post(followUser);

router.route("/user/unfollow")
    .post(unFollowUser);

router.route("/profilepic")
    .post(uploadProfilePic);

module.exports = router;