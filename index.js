const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const PORT = process.env.PORT || 8000;
const { dbConnect } = require('./db/db');
const signup = require('./routes/signup.router');
const login = require('./routes/login.router');
const post = require('./routes/post.router');
const notification = require('./routes/notification.router');
const user = require('./routes/user.router');
const search = require('./routes/search.router')

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cors());
dbConnect();

app.get('/', (req, res) => {
    res.json({ success: true, message: 'social media api' });
})

app.use('/signup', signup)
app.use('/login', login)
app.use('/post', post)
app.use('/notification', notification)
app.use('/user', user)
app.use('/search', search)

app.use((req, res) => {
    res.status(404).json({ success: false, message: "No such route defined." })
})
app.use(((err, req, res, next) => {
    console.log("error: ", err.stack)
    res.status(500).json({ success: false, message: err.message })
}))
app.listen(PORT, () => {
    console.log('SERVER STARTED');
})