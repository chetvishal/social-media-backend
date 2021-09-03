const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

router.route('/')
    .post(async (req, res) => {
        try {
            const { username, password, email, name } = req.body.data;
            const checkUser = await User.findOne({ username })
            if (checkUser) {
                return res.status(409).json({ success: false, message: "account already exists with same username" })
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                name,
                password: hashedPassword,
                email
            });
            await newUser.save()
            res.status(201).json({ success: true, message: "successfully created new account" })
        } catch (error) {
            res.status(500).json({ success: false, message: "failed to create account", errMessage: error.message })
        }
    })


module.exports = router;