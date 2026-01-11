import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, MessageCircle, Share2, Pin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CommunityDetail() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const { toast } = useToast();

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);

  const [replyText, setReplyText] = useState("");
  const [activeReplyPost, setActiveReplyPost] = useState(null);

  /* ================= FETCH POSTS ================= */
  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `https://arogyam-9rll.onrender.com/api/community/${id}/posts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ================= CREATE POST ================= */
  const createPost = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing info",
        description: "Title and content required",
        variant: "destructive",
      });
      return;
    }

    await axios.post(
      `https://arogyam-9rll.onrender.com/api/community/${id}/posts`,
      { title, content },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTitle("");
    setContent("");
    setShowNewPost(false);
    fetchPosts();
  };

  /* ================= LIKE ================= */
  const likePost = async (postId) => {
    await axios.post(
      `https://arogyam-9rll.onrender.com/api/community/${postId}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchPosts();
  };

  /* ================= REPLY ================= */
  const submitReply = async (postId) => {
    if (!replyText.trim()) return;

    await axios.post(
      `https://arogyam-9rll.onrender.com/api/community/${postId}/reply`,
      { content: replyText },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setReplyText("");
    setActiveReplyPost(null);
    fetchPosts();
  };

  /* ================= SHARE ================= */
  const sharePost = (postId) => {
    const url = `${window.location.origin}/community/${id}?post=${postId}`;
    navigator.clipboard.writeText(url);

    toast({
      title: "Link copied",
      description: "Post link copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Community Discussion</h1>
        <Button onClick={() => setShowNewPost(!showNewPost)}>
          {showNewPost ? "Cancel" : "New Post"}
        </Button>
      </div>

      {/* NEW POST */}
      {showNewPost && (
        <Card className="p-6 mb-6">
          <Input
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            className="mt-3"
            placeholder="Write something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button className="mt-3" onClick={createPost}>
            Post
          </Button>
        </Card>
      )}

      {/* POSTS */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post._id} className="p-6">
            <div className="flex gap-4">
              <Avatar>
                <AvatarFallback>
                  {post.author?.fullName?.[0] || "👤"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                {/* META */}
                <div className="flex items-center gap-2 text-sm">
                  {post.isPinned && <Pin className="w-4 h-4 text-primary" />}
                  <Badge variant="outline">General</Badge>
                  <span className="font-medium">
                    {post.author?.fullName || "Unknown"}
                  </span>
                  <span className="text-muted-foreground">
                    • {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* CONTENT */}
                <h3 className="font-semibold mt-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {post.content}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                  <button
                    onClick={() => likePost(post._id)}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {post.likes.length}
                  </button>

                  <button
                    onClick={() => setActiveReplyPost(post._id)}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {post.replies.length}
                  </button>

                  <button
                    onClick={() => sharePost(post._id)}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                {/* REPLY INPUT */}
                {activeReplyPost === post._id && (
                  <div className="mt-3">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => submitReply(post._id)}
                    >
                      Reply
                    </Button>
                  </div>
                )}

                {/* REPLIES */}
                {post.replies.map((r) => (
                  <div key={r._id} className="ml-10 mt-3 text-sm">
                    <span className="font-medium">
                      {r.author?.fullName || "User"}
                    </span>
                    <p className="text-muted-foreground">{r.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
