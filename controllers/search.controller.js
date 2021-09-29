const User = require("../models/user.model");

const searchUser = async (req, res, next) => {
    try {
        const { searchQuery } = req.query;
        const usernames = await User.find({"username": { "$regex": searchQuery, "$options": "i" }})
        const names = await User.find({"name": { "$regex": searchQuery, "$options": "i" }})
        const list = usernames.concat(names)

        res.status(200).json({ success: true, users: list });
    } catch (error) {
        console.log("failed to fetch notifications")
        res.status(500).json({ success: false, message: error.message })
    }
};




module.exports = {
    searchUser
};