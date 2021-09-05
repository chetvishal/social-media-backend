const express = require("express");
const {
    getAllUserPosts,
    addNewPost,
    updatePost,
    getPost,
    newComment,
    likePost,
    getPostByUserName,
    getUserFeed,
    randomFeed,
    getAllPosts
} = require("../controllers/post.controller");
const router = express.Router();
const { AuthVerification } = require("../middlewares/AuthVerification");
const { getPostById } = require("../middlewares/paramHandler");

router.use(AuthVerification)
router.route("/")
    .get(getAllUserPosts)
    .post(addNewPost);

router.route('/getallposts')
    .get(getAllPosts)

router.route('/random')
    .get(randomFeed)

router.route("/feed")
    .post(getUserFeed);

router.route("/user/:username")
    .get(getPostByUserName);

router.param("postId", getPostById);

router.route("/:postId")
    .get(getPost)
    .post(updatePost)

router.route("/:postId/likes")
    .post(likePost);

router.route('/:postId/comment')
    .post(newComment)

module.exports = router;
