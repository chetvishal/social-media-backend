const { Post } = require("../models/post.model");
const { extend } = require("lodash");
const User = require("../models/user.model");
const { Notification } = require("../models/notification.model");
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
    console.log("getfeededatastarts")
    let promises = user.following.map(async (id) => {
        const posts = await Post.find({ userId: id })
            .populate([{ path: 'userId', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
            .sort({ createdAt: "desc" })
        return posts
    })
    console.log("its here between", promises)
    const userPosts = await Post.find({ userId: id })
        .populate([{ path: 'userId', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
        .sort({ createdAt: "desc" })
    let promiseAll = await Promise.all(promises)
    // console.log("promise all end", promiseAll[0][0].userId)
    console.log("promise all end", promiseAll)
    var merged = [].concat.apply([], promiseAll);
    console.log("merged promise: ", merged)
    // let feed = followingFeed.concat(userPosts);
    // console.log("the feed: ", feed)
    // return feed;
    return merged.concat(userPosts)
}

const getUserFeed = async (req, res, next) => {
    try {
        console.log("user feed: ", req.body);
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(403)
                .json({ success: false, errorMessage: "User doesn't exist!" });
        }

        // let feed = [];
        // user.following.slice(-5).forEach(async (id) => {
        //     const posts = await Post.find({ userId: id })
        //         // .limit(5)
        //         // .populate({ path: 'userId' })
        //         // .exec()
        //         .sort({ createdAt: "desc" })
        //     feed = [...posts, ...feed];
        // });
        // const userPosts = await Post.find({ userId })
        //     // .limit(5)
        //     .sort({ createdAt: "desc" })
        // feed = feed.concat(userPosts);

        // let feed = [];
        // await user.following.forEach(async (id) => {
        //     const posts = await Post.find({ userId: id })
        // .limit(5)
        // .populate([{ path: 'userId', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
        // .exec()
        //         .sort({ createdAt: "desc" })
        //     console.log("im running: ", posts)
        //     feed = [...posts, ...feed];
        // })
        // console.log("feed after array: ", feed)
        // const userPosts = await Post.find({ userId })
        // .limit(5)
        // .populate([{ path: 'userId', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
        //     .sort({ createdAt: "desc" })
        // feed = feed.concat(userPosts);
        // console.log("feed after concatenating: ", feed)


        let letsc = await getFeedData(user, userId)
        // console.log("letsc: ", letsc)

        res.status(200).json({ success: true, posts: letsc });
    } catch (error) {
        next(error);
    }
};

const getAllUserPosts = async (req, res, next) => {
    try {
        console.log("req: ", req.body)
        const { userId } = req.body;
        const posts = await Post.find({ userId })
            .sort({ createdAt: "desc" })
            .populate([{ path: 'userId', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.log("Unable to fetch posts", error.message)
        res.status(500).json({ success: false, message: "Unable to fetch posts", errMessage: error.message })
    }
};

const createNotificationsForNewPost = async (postId, userId) => {
    try {

        // const notification = await Notification.findOne({ userId });
        const { followers } = await User.findById(userId).select("followers");

        const newNotification = {
            notificationType: "Post",
            postId,
            originUser: userId,
        };
        const notifications = followers.map((followerId) => ({
            ...newNotification,
            notificationFor: followerId,
        }));
        Notification.insertMany(notifications);
        // return res.status(201).json({ success: true, message: "successfully created notifications" });



        // if (notification) {
        //     notification.notificationList.push({
        //         for: "Post",
        //         postId,
        //         originUser: userId
        //     })
        //     const saveItem = await notification.save()
        //     return res.status(201).json({ success: true, message: "successfully created new notification", notification: saveItem })
        // }
        // else {
        //     let notificationItem = new Notification({
        //         userId,
        //         notificationList: [
        //             {
        //                 for: "Post",
        //                 postId,
        //                 originUser: userId
        //             }
        //         ]
        //     })
        //     const saveItem = await notificationItem.save()
        //     return res.status(201).json({ success: true, message: "successfully created new notification", notification: saveItem })
        // }
        // const newNotification = {
        //     type: "New Post",
        //     postId,
        //     originUser: userId,
        // };
        // const { followers } = await User.findById(userId).select("followers");
        // const notifications = followers.map((followerId) => ({
        //     ...newNotification,
        //     destinationUser: followerId,
        // }));
        // Notification.insertMany(notifications);
    } catch (error) {
        // return res.status(500).json({ success: false, message: error.message })
        console.log("error creating notification", error.message)
    }
};

const addNewPost = async (req, res, next) => {
    try {
        console.log("req: ", req.body)
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
    console.log("its running")
    try {
        let { postId } = req.params;
        let { post } = req;
        console.log("post data from paramhandler: ", post)
        // const post = await Post.findById({ _id: postId })
        // .populate('userId').execPopulate();
        // exec(function (err, userData) {
        //     if (err) return handleError(err);
        //     console.log('The author is %s', userData);
        //     // prints "The author is Ian Fleming"
        // });

        // if (!post) {
        //     return res
        //         .status(400)
        //         .json({ success: false, message: "Post was not found" });
        // }
        // let postData = await post.populate("userId").execPopulate();

        // console.log("its running", postData)
        // let postData = await post.populate({ path: 'userId', model: "User", select: ["_id", "name", "username", "avatarUrl"] }).execPopulate();
        // console.log("postData: ", postData)
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

// const getUsersWhoLikedPost = async (req, res, next) => {
//     try {
//         let { post } = req;
//         post = await post.populate({ path: "likes.reactedUsers" }).execPopulate();
//         res
//             .status(200)
//             .json({ success: true, post: { id: post._id, likes: post.likes } });
//     } catch (error) {
//         next(error);
//     }
// };

const likePost = async (req, res, next) => {
    try {
        const { userId, like } = req.body;
        const { postId } = req.params;
        let post = await Post.findById(postId);
        if (like) {
            const savedItem = post.likes.push(userId)
            await post.save()
            createNotificationForLike(post, userId)
            console.log("liked pic")
            return res.status(201).json({ success: true, savedItem, message: "successfully liked post" })
        }
        else {
            const savedItem = post.likes.pull(userId)
            await post.save()
            console.log("unliked pic")
            return res.status(201).json({ success: true, savedItem, message: "successfully removed like" })
        }
        // console.log("userId, like", userId, like)
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
};

const createNotificationForLike = async (post, userId) => {
    try {
        const newNotification = {
            notificationType: "Like",
            postId: post._id,
            originUser: userId,
            notificationFor: post.userId,
        };
        const saveitem = new Notification(newNotification);
        await saveitem.save()
    } catch (error) {
        return new Error("Like notification failed!");
    }
};

const newComment = async (req, res, next) => {
    try {
        const { commentText, commentUserId } = req.body;
        const { postId } = req.params;
        let post = await Post.findById(postId);
        post.comments.push(req.body)
        const savedItem = await post.save()
        const populateItem = await savedItem.populate({ path: 'comments.commentUserId', model: "User", select: ["_id", "name", "username", "avatarUrl"] }).execPopulate()
        res.status(201).json({ success: true, savedItem: populateItem })
        createNotificationForComment(post, commentUserId)
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

const createNotificationForComment = async (post, userId) => {
    try {
        const newNotification = {
            notificationType: "Comment",
            postId: post._id,
            originUser: userId,
            notificationFor: post.userId,
        };
        const saveitem = new Notification(newNotification);
        await saveitem.save()
    } catch (error) {
        return new Error("failed to create notification for comment");
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
    // removePost,
    // getUsersWhoLikedPost,
    newComment,
    likePost,
    getPostByUserName,
    getUserFeed,
    randomFeed,
    getAllPosts
};
