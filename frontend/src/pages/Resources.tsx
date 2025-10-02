import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Play,
  BookOpen,
  Headphones,
  Download,
  Clock,
  Star,
  Search,
  X
} from "lucide-react";

// Set your actual Cloudinary cloud name below
import api from "@/config/api";
const cloudinaryBase = "https://res.cloudinary.com/dlpyvzfis/video/upload/";

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [resources, setResources] = useState({
    videos: [],
    guides: [],
    exercises: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);

        

        const response = await api.get(`/hub`); // Replace with actual API URL

        const data = response.data;

        // Safe fallback in case any key is missing
        setResources({
          videos: data.videos || [],
          guides: data.guides || [],
          exercises: data.exercises || []
        });
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Resource Hub</h1>
        <p className="text-muted-foreground">
          Access videos, guides, and exercises for mental wellness
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="videos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Guides
          </TabsTrigger>
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            Exercises
          </TabsTrigger>
        </TabsList>

        {/* VIDEOS */}
        <TabsContent value="videos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.videos.map((video) => (
              <Card key={video._id} className="overflow-hidden group hover:shadow-lg transition-all">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-4xl">
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <Play className="w-12 h-12 text-primary" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {video.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {video.rating}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {video.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {video.tags?.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full" onClick={() => {
                    setSelectedVideo(video);
                    setIsModalOpen(true);
                  }}>
                    <Play className="w-4 h-4 mr-2" />
                    Watch Video
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* GUIDES */}
        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.guides.map((guide) => (
              <Card key={guide.id} className="p-6 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">{guide.icon}</div>
                <Badge variant="secondary" className="mb-3">
                  {guide.category}
                </Badge>
                <h3 className="font-semibold mb-2">{guide.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {guide.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <Clock className="w-3 h-3" />
                  {guide.readTime}
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {guide.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Guide
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* EXERCISES */}
        <TabsContent value="exercises" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.exercises.map((exercise) => (
              <Card key={exercise.id} className="p-6 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">{exercise.icon}</div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{exercise.category}</Badge>
                  <Badge variant={exercise.difficulty === 'Beginner' ? 'default' : 'outline'}>
                    {exercise.difficulty}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2">{exercise.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {exercise.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <Clock className="w-3 h-3" />
                  {exercise.duration}
                </div>
                <Button className="w-full">
                  <Headphones className="w-4 h-4 mr-2" />
                  Start Exercise
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Video Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="space-y-4">
              <div className="w-full flex justify-center">
                <video
                  controls
                  className="w-full max-w-3xl h-auto max-h-[70vh] rounded-lg"
                  poster={selectedVideo?.thumbnailUrl}
                  preload="metadata"
                  playsInline
                >
                  {selectedVideo.videoUrl ? (
                    <source
                      src={
                        selectedVideo.videoUrl.startsWith('http')
                          ? selectedVideo.videoUrl
                          : cloudinaryBase + selectedVideo.videoUrl
                      }
                      type="video/mp4"
                    />
                  ) : (
                    <div className="text-center text-red-500 p-4">Video URL not available</div>
                  )}
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedVideo.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {selectedVideo.rating}
                </div>
                <Badge variant="secondary">{selectedVideo.category}</Badge>
              </div>
              <p className="text-sm">{selectedVideo.description}</p>
              {selectedVideo.tags && (
                <div className="flex flex-wrap gap-1">
                  {selectedVideo.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
