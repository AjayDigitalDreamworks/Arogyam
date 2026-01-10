const express = require("express");
const router = express.Router();
const Community = require("../models/community");
const CommunityPost = require("../models/comments");
const { verifyToken } = require("../middleware/authMiddleware");

// GET ALL COMMUNITIES
router.get("/", async (req, res) => {
  const communities = await Community.find().populate("members", "_id");
  res.json(communities);
});


router.post("/create", verifyToken, async (req, res) => {
  try {
    
    const { role, name, description } = req.body;
    console.log(role);

    if (role !== "volunteer") {
      return res.status(403).json({
        message: "Only volunteers can create communities",
      });
    }

    const community = await Community.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    res.json(community);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});



// JOIN COMMUNITY
router.post("/:id/join", verifyToken, async (req, res) => {
    // console.log(req.user);
  await Community.findByIdAndUpdate(req.params.id, {
    $addToSet: { members: req.user._id },
  });
  res.json({ success: true });
});

// GET POSTS
router.get("/:id/posts",verifyToken, async (req, res) => {
  const posts = await CommunityPost.find({ community: req.params.id })
    .populate("author", "fullName avatar")
    .populate("replies.author", "fullName avatar");
  res.json(posts);
});

// CREATE POST
router.post("/:id/posts", verifyToken, async (req, res) => {

    // console.log("REQ.USER:", req.params.id);
  try {
    // console.log("REQ.USER:", req.user);

    const post = await CommunityPost.create({
      community: req.params.id,
      author: req.user.userId,
      title: req.body.title,
      content: req.body.content,
    });

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/:postId/like", verifyToken, async (req, res) => {
  const post = await CommunityPost.findById(req.params.postId);

  const userId = req.user.userId;

  if (post.likes.includes(userId)) {
    post.likes.pull(userId); 
  } else {
    post.likes.push(userId); 
  }

  await post.save();
  res.json({ likes: post.likes.length });
});

router.post("/:postId/reply", verifyToken, async (req, res) => {
  const post = await CommunityPost.findById(req.params.postId);

  post.replies.push({
    author: req.user.userId,
    content: req.body.content,
  });

  console.log(post.replies);

  await post.save();
  res.json(post.replies);
});




module.exports = router;
