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


module.exports = {
    getUserNotifications
};