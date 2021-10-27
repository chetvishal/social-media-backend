const { Post } = require("../models/post.model");
const { extend } = require("lodash");
const User = require("../models/user.model");
const { createNotificationsForNewPost, createNotificationForLike, createNotificationForComment } = require('./notification.controller');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const randomFeed = async (req, res, next) => {
    try {


        const posts = await Post.find({ userId: "6127baf90403632c58d1f750" })
            // .limit(5)
            .populate([{ path: 'userId', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
            // .exec()
            .sort({ createdAt: "desc" })





        res.status(200).json({ success: true, posts });
    } catch (error) {
        next(error);
    }
}

const getFeedData = async (user, id) => {
    let promises = user.following.map(async (id) => {
        const posts = await Post.find({ userId: id })
            .populate([{ path: 'userId', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
            .sort({ createdAt: "desc" })
        return posts
    })
    const userPosts = await Post.find({ userId: id })
        .populate([{ path: 'userId', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
        .sort({ createdAt: "desc" })
    let promiseAll = await Promise.all(promises)
    let merged = [].concat.apply([], promiseAll).concat(userPosts)
    merged.sort((post, nextPost) => nextPost.createdAt - post.createdAt);
    return merged
}

const getUserFeed = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(403)
                .json({ success: false, errorMessage: "User doesn't exist!" });
        }


        let feedData = await getFeedData(user, userId)

        res.status(200).json({ success: true, posts: feedData });
    } catch (error) {
        next(error);
    }
};

const getAllUserPosts = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId })
            .sort({ createdAt: "desc" })
            .populate([{ path: 'userId', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.log("Unable to fetch posts", error.message)
        res.status(500).json({ success: false, message: "Unable to fetch posts", errMessage: error.message })
    }
};



const addNewPost = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const newPost = new Post({ ...req.body });
        post = await newPost.save();
        const populatePost = await post
            .populate([{ path: 'userId', model: "User", select: ["_id", "name", "username", "avatarUrl"] }]).execPopulate()
        res.status(201).json({ success: true, post: populatePost });
        createNotificationsForNewPost(post._id, userId);
    } catch (error) {
        console.log("Unable to add new post")
        res.status(500).json({ success: false, message: "Unable to add new post", errMessage: error.message })
    }
};

const getPost = async (req, res, next) => {
    try {
        let { post } = req;

        return res.status(200).json({ success: true, post: post });
    } catch (error) {
        res.status(500).json({ success: false, message: "failed to fetch data", errMessage: error.message })
    }
};

const getPostByUserName = async (req, res, next) => {
    try {
        const { username } = req.body;
        const posts = await Post.find({ username });
        res.status(200).json({ success: true, posts });
    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res, next) => {
    try {
        let { postId } = req.params;
        let post = await Post.findById(postId);
        if (!post) {
            return res
                .status(400)
                .json({ success: false, message: "Post was not found" });
        }
        const updatePost = req.body;
        post = extend(post, updatePost);
        post = await post.save();
        res.status(201).json({ success: true, post });
    } catch (error) {
        console.log("Failed to update post")
        res.status(500).json({ success: false, message: "Failed to update post", errMessage: error.message })
    }
};

const likePost = async (req, res, next) => {
    try {
        const { userId, like } = req.body;
        const { postId } = req.params;
        let post = await Post.findById(postId);
        if (like) {
            const savedItem = post.likes.push(userId)
            await post.save()
            createNotificationForLike(post, userId)
            return res.status(201).json({ success: true, savedItem, message: "successfully liked post" })
        }
        else {
            const savedItem = post.likes.pull(userId)
            await post.save()
            return res.status(201).json({ success: true, savedItem, message: "successfully removed like" })
        }
        // console.log("userId, like", userId, like)
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
};

const newComment = async (req, res, next) => {
    try {
        const { commentText, commentUserId } = req.body;
        const { postId } = req.params;
        let post = await Post.findById(postId);
        post.comments.unshift(req.body)
        const savedItem = await post.save()
        const populateItem = await savedItem.populate({ path: 'comments.commentUserId', model: "User", select: ["_id", "name", "username", "avatarUrl"] }).execPopulate()
        res.status(201).json({ success: true, savedItem: populateItem })
        createNotificationForComment(post, commentUserId)
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


const getAllPosts = async (req, res, next) => {
    try {

        const posts = await Post.find({}).populate([{ path: 'userId', model: "User", select: ["_id", "name", "username", "avatarUrl"] }]);
        res.status(200).json({ success: true, posts });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getAllUserPosts,
    addNewPost,
    getPost,
    updatePost,
    newComment,
    likePost,
    getPostByUserName,
    getUserFeed,
    randomFeed,
    getAllPosts
};
