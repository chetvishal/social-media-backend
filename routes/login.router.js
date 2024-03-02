const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const secret = process.env['SECRET']

router.route('/')
    .post(async (req, res) => {
        try {
            const { username, password } = req.body.user;
            const userFound = await User.findOne({ username: username })
            if (userFound) {
                userFound.comparePassword(password, (err, isMatch) => {
                    const accessToken = jwt.sign({ userId: userFound._id }, secret, { expiresIn: '60 days' })
                    return isMatch ? res.status(200).json({
                        success: true,
                        accessToken,
                        userId: userFound._id,
                        username: userFound.username,
                        message: "login successfull",
                        name: userFound.name
                    }) :
                        res.status(401).json({ success: false, message: "Sorry, your password was incorrect. " })
                })
            } else {
                res.status(404).json({ success: false, message: "The username you entered doesn't belong to an account. Please check your username and try again." })
            }

        } catch (error) {
            console.log("login error: ", error)
            res.status(500).json({ success: false, message: "Login Error" })
        }
    })


module.exports = router;