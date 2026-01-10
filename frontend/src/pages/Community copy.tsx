import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Plus, 
  TrendingUp, 
  Clock,
  Users,
  Pin,
  ThumbsUp,
  MessageCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const forumPosts = [
  {
    id: '1',
    title: 'How do you manage study stress during finals?',
    content: 'Finals are coming up and I\'m feeling overwhelmed. Any tips that have worked for you?',
    author: 'Alex M.',
    authorAvatar: '🎓',
    timestamp: '2 hours ago',
    category: 'Academic Stress',
    replies: 12,
    likes: 8,
    isPinned: false,
    tags: ['finals', 'stress', 'study tips']
  },
  {
    id: '2',
    title: 'Meditation apps that actually work?',
    content: 'I\'ve tried a few meditation apps but haven\'t found one that clicks. What are your recommendations?',
    author: 'Sam K.',
    authorAvatar: '🧘‍♀️',
    timestamp: '5 hours ago',
    category: 'Mindfulness',
    replies: 18,
    likes: 15,
    isPinned: true,
    tags: ['meditation', 'apps', 'mindfulness']
  },
  {
    id: '3',
    title: 'Dealing with homesickness in sophomore year',
    content: 'I thought homesickness would get better after freshman year, but it\'s still hitting hard. Anyone else experience this?',
    author: 'Jordan L.',
    authorAvatar: '🏠',
    timestamp: '1 day ago',
    category: 'Social Support',
    replies: 24,
    likes: 32,
    isPinned: false,
    tags: ['homesickness', 'sophomore', 'support']
  },
  {
    id: '4',
    title: 'Success story: Overcoming social anxiety',
    content: 'Just wanted to share that after working with the counseling center for 6 months, I finally feel comfortable in social situations!',
    author: 'Taylor P.',
    authorAvatar: '🌟',
    timestamp: '2 days ago',
    category: 'Success Stories',
    replies: 45,
    likes: 89,
    isPinned: false,
    tags: ['success', 'social anxiety', 'counseling']
  }
];

const categories = [
  { name: 'All Posts', count: 156, color: 'bg-primary' },
  { name: 'Academic Stress', count: 42, color: 'bg-blue-500' },
  { name: 'Social Support', count: 38, color: 'bg-green-500' },
  { name: 'Mindfulness', count: 24, color: 'bg-purple-500' },
  { name: 'Success Stories', count: 18, color: 'bg-yellow-500' },
  { name: 'Sleep & Wellness', count: 34, color: 'bg-indigo-500' }
];

const trendingTopics = [
  '# Finals Week Prep',
  '# Meditation Monday',
  '# Wellness Wednesday',
  '# Self Care Sunday',
  '# Study Groups'
];

export default function Community() {
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Academic Stress');
  const [showNewPost, setShowNewPost] = useState(false);
  const { toast } = useToast();

  const handleSubmitPost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Post Created!",
      description: "Your post has been shared with the community.",
    });

    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPost(false);
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
        <p className="text-muted-foreground">
          Connect with fellow students and share experiences in a safe, supportive environment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* New Post Button */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Recent Discussions</h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Trending
              </Badge>
            </div>
            <Button 
              onClick={() => setShowNewPost(!showNewPost)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </div>

          {/* New Post Form */}
          {showNewPost && (
            <Card className="wellness-card p-6">
              <h3 className="font-semibold mb-4">Share with the Community</h3>
              <div className="space-y-4">
                <Input
                  placeholder="What's on your mind? Give your post a title..."
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Share your thoughts, questions, or experiences..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={4}
                />
                <div className="flex items-center gap-3">
                  <select 
                    className="px-3 py-2 border border-border rounded-md text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-2 ml-auto">
                    <Button variant="outline" onClick={() => setShowNewPost(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitPost}>
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Forum Posts */}
          <div className="space-y-4">
            {forumPosts.map((post) => (
              <Card key={post.id} className="wellness-card p-6 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="text-lg">
                      {post.authorAvatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {post.isPinned && (
                        <Pin className="w-4 h-4 text-primary" />
                      )}
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-sm font-medium">{post.author}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                    </div>
                    
                    <h3 className="font-semibold mb-2 hover:text-primary cursor-pointer">
                      {post.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {post.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {post.replies} replies
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Guidelines */}
          <Card className="wellness-card p-6">
            <h3 className="font-semibold mb-4">Community Guidelines</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Be respectful and kind to others</li>
              <li>• No personal attacks or harassment</li>
              <li>• Share experiences, not advice as medical professionals</li>
              <li>• Use content warnings for sensitive topics</li>
              <li>• Keep posts relevant to student mental health</li>
            </ul>
          </Card>

          {/* Categories */}
          <Card className="wellness-card p-6">
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Trending Topics */}
          <Card className="wellness-card p-6">
            <h3 className="font-semibold mb-4">Trending Topics</h3>
            <div className="space-y-2">
              {trendingTopics.map((topic) => (
                <div key={topic} className="text-sm text-primary cursor-pointer hover:underline">
                  {topic}
                </div>
              ))}
            </div>
          </Card>

          {/* Community Stats */}
          <Card className="wellness-card p-6">
            <h3 className="font-semibold mb-4">Community Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Members</span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Posts This Week</span>
                <span className="font-semibold">89</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Online Now</span>
                <span className="font-semibold text-green-600">156</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}