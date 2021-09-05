const User = require("../models/user.model");

const searchUser = async (req, res, next) => {
    try {
        const { searchQuery } = req.query;
        const users = await User.find({"username": { "$regex": searchQuery, "$options": "i" }})

        res.status(200).json({ success: true, users });
    } catch (error) {
        console.log("failed to fetch notifications")
        res.status(500).json({ success: false, message: error.message })
    }
};




module.exports = {
    searchUser
};