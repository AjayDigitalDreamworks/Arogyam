import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const typeColors = {
  Article: "bg-primary text-primary-foreground",
  Video: "bg-secondary text-secondary-foreground",
  Guide: "bg-accent text-accent-foreground",
};

const cloudinaryBase = "https://res.cloudinary.com/dlpyvzfis/video/upload/";

export function LatestResources({ resources = [] }: { resources?: any[] }) {
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (resource: any) => {
    if (resource.type === "Video") {
      setSelectedResource(resource);
      setIsModalOpen(true);
    } else {
      // For guides or articles, you can redirect to a link
      if (resource.link) window.open(resource.link, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Latest Resources</h2>
        <Link to="/resources">
          <Button variant="ghost" className="text-primary hover:text-primary/80">
            View All Resources
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.length === 0 ? (
          <div className="text-sm text-muted-foreground">No resources available</div>
        ) : (
          resources.map((resource: any) => (
            <Card
              key={resource._id || resource.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Thumbnail */}
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {resource.thumbnailUrl ? (
                  <img
                    src={resource.thumbnailUrl}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">📚</span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge
                    className={
                      typeColors[resource.type as keyof typeof typeColors] || "bg-muted"
                    }
                  >
                    {resource.type || "Article"}
                  </Badge>
                  {resource.duration && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {resource.duration}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {resource.description}
                  </p>
                </div>

                <Button
                  className="w-full group-hover:shadow-md transition-all"
                  onClick={() => handleView(resource)}
                >
                  {resource.type === "Video" ? "Watch" : "View"}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Video Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedResource?.title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setIsModalOpen(false)}
            >
              <X />
            </Button>
          </DialogHeader>
          {selectedResource?.videoUrl && (
            <video
              controls
              className="w-full max-h-[70vh] rounded-lg mt-4"
              poster={selectedResource.thumbnailUrl}
              preload="metadata"
            >
              <source
                src={
                  selectedResource.videoUrl.startsWith("http")
                    ? selectedResource.videoUrl
                    : cloudinaryBase + selectedResource.videoUrl
                }
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
