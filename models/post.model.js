const mongoose = require("mongoose");
const { Schema } = mongoose;
require('mongoose-type-url');

const commentSchema = new Schema({
    commentText: {
        type: String,
        minLength: [1, "Comment cannot be empty"]
    },
    commentUserId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

const postSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // name: {
    //     type: String,
    //     required: "Username is required"
    // },
    username: {
        type: String,
        required: "username is required"
    },
    content: {
        type: String,
        required: "Content is required"
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [commentSchema
        // {
        //     commentText: {
        //         type: String,
        //         minLength: [1, "Comment cannot be empty"]
        //     },
        //     commentUserId: {
        //         type: Schema.Types.ObjectId,
        //         ref: "User"
        //     }
        // }
    ],
},
    {
        timestamps: true,
    });


const Post = mongoose.model("Post", postSchema);

module.exports = { Post };