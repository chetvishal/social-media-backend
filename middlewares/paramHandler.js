const { Post } = require("../models/post.model");

const getPostById = async (req, res, next, postId) => {
    try {
        const post = await Post.findOne({ _id: postId })
            .populate({ path: 'userId', model: "User", select: ["_id", "name", "username", "avatarUrl"] })
            .populate({ path: 'comments.commentUserId', model: "User", select: ["_id", "name", "username", "avatarUrl"] })
        
        req.post = post;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Couldn't retrieve the post",
            errorMessage: error.message,
        });
    }
};

module.exports = { getPostById };