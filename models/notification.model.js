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
    // userId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //     unique: true
    // },
    // notificationList: [NotificationItemSchema]
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


// const createNotificationsForNewPost = async (postId, userId) => {
//     try {
//       const newNotification = {
//         type: "New Post",
//         postId,
//         originUser: userId,
//       };
//       const { followers } = await User.findById(userId).select("followers");
//       const notifications = followers.map((followerId) => ({
//         ...newNotification,
//         destinationUser: followerId,
//       }));
//       Notification.insertMany(notifications);
//     } catch (error) {
//       return new Error("New Post notification failed!");
//     }
//   };


// const createNotificationForLike = async (post, userId) => {
//     try {
//       const newNotification = {
//         type: "Like",
//         postId: post._id,
//         originUser: userId,
//         destinationUser: post.userId,
//       };
//       Notification.create(newNotification);
//     } catch (error) {
//       return new Error("Like notification failed!");
//     }
//   };
