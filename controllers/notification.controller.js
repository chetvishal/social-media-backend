const { Notification } = require("../models/notification.model");

const getUserNotifications = async (req, res, next) => {
    try {
        const { userId } = req.params;
        console.log("userId from body getUserNotifications: ", req.params)
        const { since } = req.query;
        const notifications = await Notification.find({
            notificationFor: userId,
        })
            // .where("createdAt")
            // .gt(new Date(since))
            .populate([{ path: 'originUser', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
            .sort("-createdAt")

        // const populateData = await notifications
        //     .populate([{ path: 'originUser', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
        //     .execPopulate()
        // .select("-__v");
        if (!notifications.length)
            return res.status(200).json({ success: true, notifications: [] });

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.log("failed to fetch notifications")
        res.status(500).json({ success: false, message: error.message })
    }
};


module.exports = {
    // getAllPosts,
    getUserNotifications
};