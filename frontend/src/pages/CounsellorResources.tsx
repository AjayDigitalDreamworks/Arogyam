import React, { useState, useEffect, useRef } from "react";
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
  X,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Set your actual Cloudinary cloud name below
import api from "@/config/api";
const cloudinaryBase = "https://res.cloudinary.com/dlpyvzfis/video/upload/";

export default function CounsellorResources() {
  const { toast } = useToast();

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
  // Track which items are currently being deleted to avoid duplicate requests
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

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

  useEffect(() => {
    fetchResources();
  }, []);

  // Helper to detect whether an id looks like a MongoDB ObjectId (24 hex chars)
  const isMongoId = (id?: any) => typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id || '');

  // Listen for postMessage events from the backend upload page so we can
  // show a confirmation toast when upload completes. If uploads continue to
  // happen in a popup, the backend can post a message to the opener.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // Only accept messages from the backend origin for security
      if (e.origin !== 'https://arogyam-9rll.onrender.com') return;
      const data = e.data || {};
      if (data.type === 'upload-success') {
        toast({ title: 'Upload successful', description: data.message || 'Resource uploaded' });
        // Refresh resources list
        fetchResources();
      } else if (data.type === 'upload-failed') {
        toast({ title: 'Upload failed', description: data.message || 'Upload failed' });
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [toast]);

  // Support redirect-based feedback: if the backend redirects back with
  // ?upload=success&message=... or ?upload=failed&message=..., ensure the
  // user lands on the counsellor resources page and then show a toast.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get('upload');
    const m = params.get('message');
    if (!u) return;

    const targetPath = '/counsellor/resources';

    // If we're not on the counsellor resources path, navigate there while
    // preserving the query params so the toast is shown after navigation.
    if (window.location.pathname !== targetPath) {
      const url = window.location.origin + targetPath + window.location.search;
      window.location.replace(url);
      return;
    }

    // Already on target path: show toast and refresh resources if needed.
    if (u === 'success') {
      toast({ title: 'Upload successful', description: m || 'Resource uploaded' });
      fetchResources();
    } else if (u === 'failed') {
      toast({ title: 'Upload failed', description: m || 'Upload failed' });
    }

    // Clear query params to avoid duplicate toasts on reload.
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
  }, [toast]);

  const handleUploadClick = () => {
    // Open the backend upload form in the same tab
    window.location.href = 'https://arogyam-9rll.onrender.com/videos/upload';
  };

  // NOTE: file input upload flow removed. Backend upload form will be used instead.

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Counsellor Resource Hub</h1>
        <p className="text-muted-foreground">
          Access videos, guides, and exercises for student mental wellness — viewing as a counsellor.
        </p>
      </div>

      {/* Search + Upload */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleUploadClick} className="flex items-center gap-2">
              <Upload className="w-4 h-4" /> Open Upload Form
            </Button>
          </div>
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
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => {
                      setSelectedVideo(video);
                      setIsModalOpen(true);
                    }}>
                      <Play className="w-4 h-4 mr-2" />
                      Watch
                    </Button>

                    {/* Show delete only for DB-backed videos (valid Mongo ObjectId) */}
                    {isMongoId(video._id) ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingIds.includes(video._id)}
                        onClick={async () => {
                          if (!confirm('Delete this resource?')) return;
                          console.debug('Deleting video: ', video._id, api.defaults.baseURL + `/videos/${video._id}`);
                          setDeletingIds(prev => [...prev, video._id]);
                          try {
                            const res = await api.delete(`/videos/${video._id}`);
                            toast({ title: 'Deleted', description: res?.data?.message || 'Resource deleted' });
                            await fetchResources();
                          } catch (err) {
                            console.error('Delete failed', err?.response || err);
                            const msg = err?.response?.data?.message || err?.message || 'Could not delete resource';
                            toast({ title: 'Delete failed', description: msg });
                          } finally {
                            setDeletingIds(prev => prev.filter(id => id !== video._id));
                          }
                        }} 
                      >
                        {deletingIds.includes(video._id) ? 'Deleting...' : 'Delete'}
                      </Button>
                    ) : (
                      <div className="text-xs text-muted-foreground">(Not deletable)</div>
                    )}
                  </div>
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
                    Read
                  </Button>

                  {/* Guides may be static; only allow delete for DB-backed items */}
                  {isMongoId(String(guide.id)) ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingIds.includes(String(guide.id))}
                      onClick={async () => {
                        if (!confirm('Delete this guide?')) return;
                        console.debug('Deleting guide: ', guide.id, api.defaults.baseURL + `/videos/${guide.id}`);
                        setDeletingIds(prev => [...prev, String(guide.id)]);
                        try {
                          const res = await api.delete(`/videos/${guide.id}`);
                          toast({ title: 'Deleted', description: res?.data?.message || 'Guide deleted' });
                          await fetchResources();
                        } catch (err) {
                          console.error('Delete failed', err?.response || err);
                          const msg = err?.response?.data?.message || err?.message || 'Could not delete guide';
                          toast({ title: 'Delete failed', description: msg });
                        } finally {
                          setDeletingIds(prev => prev.filter(id => id !== String(guide.id)));
                        }
                      }} 
                    >
                      {deletingIds.includes(String(guide.id)) ? 'Deleting...' : 'Delete'}
                    </Button>
                  ) : (
                    <div className="text-xs text-muted-foreground">(Not deletable)</div>
                  )}
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
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Headphones className="w-4 h-4 mr-2" />
                    Start
                  </Button>

                  {isMongoId(String(exercise.id)) ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingIds.includes(String(exercise.id))}
                      onClick={async () => {
                        if (!confirm('Delete this exercise?')) return;
                        console.debug('Deleting exercise: ', exercise.id, api.defaults.baseURL + `/videos/${exercise.id}`);
                        setDeletingIds(prev => [...prev, String(exercise.id)]);
                        try {
                          const res = await api.delete(`/videos/${exercise.id}`);
                          toast({ title: 'Deleted', description: res?.data?.message || 'Exercise deleted' });
                          await fetchResources();
                        } catch (err) {
                          console.error('Delete failed', err?.response || err);
                          const msg = err?.response?.data?.message || err?.message || 'Could not delete exercise';
                          toast({ title: 'Delete failed', description: msg });
                        } finally {
                          setDeletingIds(prev => prev.filter(id => id !== String(exercise.id)));
                        }
                      }}
                    >
                      {deletingIds.includes(String(exercise.id)) ? 'Deleting...' : 'Delete'}
                    </Button>
                  ) : (
                    <div className="text-xs text-muted-foreground">(Not deletable)</div>
                  )}
                </div> 
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
