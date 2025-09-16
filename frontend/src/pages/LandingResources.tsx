import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Video, Headphones, Download, Heart, ArrowLeft, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import LandingFooter from "@/components/LandingFooter";

const LandingResources = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white dark:text-black" />
            </div>
            <span className="text-xl font-bold text-primary">Arogyam</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/landing-resources" className="text-primary font-medium border-b-2 border-primary pb-1">Resources</Link>
            <Link to="/landing-support" className="text-muted-foreground hover:text-primary transition-colors">Support</Link>
            <Link to="/landing-booking" className="text-muted-foreground hover:text-primary transition-colors">Book Session</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button className="bg-primary hover:bg-primary/90">
              Get Help Now
            </Button>
          </div>
        </div>
      </header>

      {/* Back Link */}
      <div className="px-6 py-4">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Mental Health Resources</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Comprehensive resources to support your mental wellness journey
          </p>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Video Resources */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-white dark:text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Video Guides</h3>
                    <p className="text-sm text-muted-foreground">Guided video content</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">5-Minute Meditation</p>
                      <p className="text-xs text-muted-foreground">Daily mindfulness practice</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Breathing Techniques</p>
                      <p className="text-xs text-muted-foreground">Anxiety relief methods</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Sleep Improvement</p>
                      <p className="text-xs text-muted-foreground">Better rest techniques</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audio Resources */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Audio Content</h3>
                    <p className="text-sm text-muted-foreground">Calming audio tracks</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Nature Sounds</p>
                      <p className="text-xs text-muted-foreground">Relaxing background audio</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Guided Relaxation</p>
                      <p className="text-xs text-muted-foreground">Progressive muscle relaxation</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Focus Music</p>
                      <p className="text-xs text-muted-foreground">Study concentration aids</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reading Materials */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Self-Help Guides</h3>
                    <p className="text-sm text-muted-foreground">Practical strategies</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Managing Exam Stress</p>
                      <p className="text-xs text-muted-foreground">Study tips & techniques</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Social Anxiety Guide</p>
                      <p className="text-xs text-muted-foreground">Building confidence</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Healthy Relationships</p>
                      <p className="text-xs text-muted-foreground">Building connections</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">10 Signs You Might Need Mental Health Support</h3>
                <p className="text-muted-foreground mb-4">
                  Learn to recognize when it's time to seek help and what resources are available to you.
                </p>
                <Button variant="outline">Read Article</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Creating a Healthy Study-Life Balance</h3>
                <p className="text-muted-foreground mb-4">
                  Practical tips for managing academic pressure while maintaining your mental health.
                </p>
                <Button variant="outline">Read Article</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Need Personal Support?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            While resources are helpful, sometimes you need someone to talk to. Our AI assistant and counselors are here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/dashboard">Chat with AI Assistant</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/landing-booking">Book a Session</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter/>
    </div>
  );
};

export default LandingResources;