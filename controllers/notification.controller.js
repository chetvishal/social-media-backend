const { Notification } = require("../models/notification.model");

const getUserNotifications = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({
            notificationFor: userId,
        })
            .populate([{ path: 'originUser', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
            .sort("-createdAt")
      
        if (!notifications.length)
            return res.status(200).json({ success: true, notifications: [] });

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.log("failed to fetch notifications")
        res.status(500).json({ success: false, message: error.message })
    }
};


//Create notification for user controller
const createNotificationForFollow = async (userId, toFollowUser) => {
    try {
        const followNotification = {
            notificationType: "Follow",
            originUser: userId,
            notificationFor: toFollowUser,
        };
        const saveItem = new Notification(followNotification);
        await saveItem.save()
    } catch (error) {
        console.log("failed to create follow notification", error.message)
    }
};

//Create notification for post controller
const createNotificationsForNewPost = async (postId, userId) => {
    try {

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
        
    } catch (error) {
        console.log("error creating notification", error.message)
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

module.exports = {
    getUserNotifications,
    createNotificationForFollow,
    createNotificationsForNewPost,
    createNotificationForLike,
    createNotificationForComment
};