const User = require("../models/user.model");

const searchUser = async (req, res, next) => {
    try {
        const { searchQuery } = req.query;
        console.log("searchQuery: ", req.query)
        const users = await User.find({"username": { "$regex": searchQuery, "$options": "i" }})
            // .where("createdAt")
            // .gt(new Date(since))
            // .populate([{ path: 'originUser', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
            // .sort("-createdAt")

        // const populateData = await notifications
        //     .populate([{ path: 'originUser', model: "User", select: ["_id", "name", "username", "avatarUrl"] }])
        //     .execPopulate()
        // .select("-__v");
        // if (!notifications.length)
        //     return res.status(200).json({ success: true, notifications: [] });

        res.status(200).json({ success: true, users });
    } catch (error) {
        console.log("failed to fetch notifications")
        res.status(500).json({ success: false, message: error.message })
    }
};




module.exports = {
    searchUser
};