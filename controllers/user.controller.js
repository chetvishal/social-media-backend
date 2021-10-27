const User = require("../models/user.model");
const { createNotificationForFollow } = require('./notification.controller');
const { Post } = require("../models/post.model");
const { extend } = require("lodash");
const { cloudinary } = require('../utils/cloudinary');

const getUserDetails = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
};

const updateUserDetails = async (req, res, next) => {
    try {
        const { _id: userId } = req.body;
        const userUpdates = req.body;
        let user = await User.findById(userId)
            .populate([{ path: 'following', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
            .populate([{ path: 'followers', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
        if (!user) {
            return res
                .status(401)
                .json({ success: false, errorMessage: "User doesn't exist!" });
        }

        user = extend(user, userUpdates);
        await user.save();
        // user.password = undefined;
        res.status(201).json({ success: true, user, message: "Successfully update user info" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "failed to update user details", errMessage: error.message })
    }
}

const getFollowLists = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const list = await User.findById(userId)
            .populate([{ path: 'following', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
            .populate([{ path: 'followers', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
        res.status(200).json({ success: true, list });
    } catch (error) {
        return res.status(500).json({ success: false, message: "failed to get follower/follwing list", errMessage: error.message })
    }
};



const followUser = async (req, res, next) => {
    try {
        const { toFollowUserId, userId } = req.body;
        const activeUser = await User.findById(userId);
        const toFollowUser = await User.findById(toFollowUserId);
        if (!toFollowUser) {
            return res
                .status(403)
                .json({ success: false, errorMessage: "User doesn't exist" });
        }

        activeUser.following.push(toFollowUserId);
        toFollowUser.followers.push(userId);
        let saveUser = await activeUser.save();

        let saveToFollowUser = await toFollowUser.save()
        let populateFollowers = await saveToFollowUser.populate([{ path: 'following', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
            .populate([{ path: 'followers', model: "User", select: ["_id", "name", "username", "avatarUrl"] }]).execPopulate()

        res.status(201).json({ success: true, userData: populateFollowers });
        createNotificationForFollow(userId, toFollowUserId);
    } catch (error) {
        return res.status(500).json({ success: false, message: "failed to follow user" })
    }
}

const unFollowUser = async (req, res, next) => {
    try {
        const { toUnFollowUserId, userId } = req.body;
        const activeUser = await User.findById(userId);
        const toUnFollowUser = await User.findById(toUnFollowUserId);
        if (!toUnFollowUser) {
            return res
                .status(403)
                .json({ success: false, errorMessage: "User doesn't exist" });
        }

        activeUser.following.pull(toUnFollowUserId);
        toUnFollowUser.followers.pull(userId);
        let saveUser = await activeUser.save();
        let saveToUnFollowUser = await toUnFollowUser.save()

        let populateUserData = await saveToUnFollowUser.populate([{ path: 'following', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
            .populate([{ path: 'followers', model: "User", select: ["_id", "name", "username", "avatarUrl"] }]).execPopulate()

        res.status(201).json({ success: true, userData: populateUserData });
    } catch (error) {
        return res.status(500).json({ success: false, message: "failed to follow user" })
    }
}

const getUserDetailsByUsername = async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username })
            .populate([{ path: 'following', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
            .populate([{ path: 'followers', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
        const posts = await Post.find({ username })
            .sort({ createdAt: "desc" })
            .populate([{ path: 'userId', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])

        if (user)
            return res.status(200).json({ success: true, user, posts });

        return res.status(404).json({ success: false, message: "user not found" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "failed to fetch user data", errMessage: error.message })
    }
}

const uploadProfilePic = async (req, res, next) => {
    try {
        const { userId, encodedImage } = req.body;
        let user = await User.findById(userId)
        if (!user) {
            return res
                .status(401)
                .json({ success: false, errorMessage: "User doesn't exist!" });
        }
        const uploadResponse = await cloudinary.uploader.upload(encodedImage, {
            upload_preset: 'profile_pic',
        });
        user = extend(user, { avatarUrl: uploadResponse.url });
        await user.save();

        res.status(201).json({ success: true, message: "successfully updated profile picture", pictureUrl: uploadResponse.url });
    } catch (error) {
        console.log("failed to upload profile picture: ", error)
        return res.status(500).json({ success: false, message: "failed to upload profile picture", error: error.message })
    }
}

module.exports = {
    getUserDetails,
    updateUserDetails,
    getFollowLists,
    followUser,
    unFollowUser,
    getUserDetailsByUsername,
    uploadProfilePic
};