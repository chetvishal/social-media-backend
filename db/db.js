const mongoose = require('mongoose');
const mongoURI = process.env['MONGO_URI']

async function dbConnect() {
    mongoose.connect(
        mongoURI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
        .then(() => console.log('Successfully connected to mongoDB'))
        .catch(err => console.log("Error connecting to mongoDB: ", err))
}

module.exports = { dbConnect }