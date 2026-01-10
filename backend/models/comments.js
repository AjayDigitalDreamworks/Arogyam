const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const communityPostSchema = new mongoose.Schema(
  {
    community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    content: String,

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 👍
    replies: [replySchema], // 💬

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommunityPost", communityPostSchema);
