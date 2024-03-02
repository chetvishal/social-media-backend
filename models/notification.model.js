const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotificationItemSchema = new Schema(
    {
        for: {
            type: String,
            required: true,
            enum: ["Like", "Post", "Follow", "Comment"],
        },
        postId: { type: Schema.Types.ObjectId, ref: "Post" },
        originUser: { type: Schema.Types.ObjectId, ref: "User" },
        read: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const NotificationSchema = new Schema({
  
    notificationType: {
        type: String,
        required: true,
        enum: ["Like", "Post", "Follow", "Comment"],
    },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    originUser: { type: Schema.Types.ObjectId, ref: "User" },
    notificationFor: { type: Schema.Types.ObjectId, ref: "User" },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = { Notification };



