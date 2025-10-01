import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Calendar, BookOpen, Users, CheckCircle, Heart, Brain, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import studentsIllustration from "@/assets/students-illustration.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import LandingFooter from "@/components/LandingFooter";
import  { useState , useEffect} from "react";
import axios from "axios";



const Landing = () => {
   
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
            <Link to="/" className="text-primary font-medium border-b-2 border-primary pb-1">Home</Link>
            <Link to="/landing-resources" className="text-muted-foreground hover:text-primary transition-colors">Resources</Link>
            <Link to="/landing-support" className="text-muted-foreground hover:text-primary transition-colors">Support</Link>
            <Link to="/landing-booking" className="text-muted-foreground hover:text-primary transition-colors">Book Session</Link>
          </nav>


          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button> */}

            <Button className="bg-primary hover:bg-primary/90">
            <a href="https://sih-2025-arogyam-0cf2.onrender.com/signup">signup</a>


            </Button>
             <Button className="bg-primary hover:bg-primary/90">
            <a href="https://sih-2025-arogyam-0cf2.onrender.com/login">login</a>


            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {/* <section className="px-6 py-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Your Mental Wellness,{" "}
                <span className="text-primary">Our Priority</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Get immediate, confidential, and stigma-free mental health support 
                designed specifically for college students. You're not alone in 
                this journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  asChild
                >
                  <Link to="/chat">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Chat Now
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                >
                  <Link to="/appointments">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Appointment
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img 
                src={studentsIllustration} 
                alt="Students supporting each other under a tree" 
                className="w-full max-w-md rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section> */}
      <section className="px-6 py-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Your Mental Wellness,{" "}
                <span className="text-primary">Our Priority</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Get immediate, confidential, and stigma-free mental health support 
                designed specifically for college students. You're not alone in 
                this journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  asChild
                >
                  <Link to="/dashboard">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Chat Now
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                >
                  <Link to="/landing-booking">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Appointment
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img 
                src={studentsIllustration} 
                alt="Students supporting each other under a tree" 
                className="w-full max-w-md rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 24/7 AI Assistant Section */}
      <section className="px-6 py-16 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">24/7 AI Mental Health Assistant</h2>
          <p className="text-muted-foreground mb-8">
            Get instant support, coping strategies, and guidance whenever you need it
          </p>
          
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-wellness-blue rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Arogyam Assistant</p>
                  <p className="text-sm text-muted-foreground">Always here to help</p>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-3 mb-3 text-left">
                <p className="text-sm">Hi there! I'm here to support you. How are you feeling today?</p>
              </div>
              
              <div className="bg-primary text-primary-foreground rounded-lg p-3 mb-4 text-left ml-8">
                <p className="text-sm">I've been feeling anxious about my exams</p>
              </div>
              
              <div className="bg-muted rounded-lg p-3 text-left">
                <p className="text-sm">I understand exam anxiety can be overwhelming. Let me share some breathing techniques that can help...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="px-6 py-16 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Access to Support</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="wellness-card text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white dark:text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Book Confidential Session</h3>
                <p className="text-muted-foreground mb-6">
                  Schedule private one-on-one sessions with licensed counselors
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                  <Link to="/appointments">Book Now</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="wellness-card text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white dark:text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Learning Resources</h3>
                <p className="text-muted-foreground mb-6">
                  Access videos, guides, and tools for mental wellness
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/resources">Explore</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="wellness-card text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white dark:text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Peer Support</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with other students in a safe, moderated space
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/community">Join Community</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mental Wellness Resources */}
      <section className="px-6 py-16 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Mental Wellness Resources</h2>
            <p className="text-muted-foreground">Curated content to support your mental health journey</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button variant="default" size="sm">All Topics</Button>
            <Button variant="outline" size="sm">Anxiety</Button>
            <Button variant="outline" size="sm">Sleep</Button>
            <Button variant="outline" size="sm">Stress</Button>
            <Button variant="outline" size="sm">Relationships</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="wellness-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-wellness-blue rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Guided Meditation Videos</h3>
                    <p className="text-sm text-muted-foreground">5-minute daily meditation sessions for stress relief</p>
                  </div>
                </div>
                <p className="text-wellness-blue text-sm mb-2">12 videos</p>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-primary">
                  View all →
                </Button>
              </CardContent>
            </Card>
            
            <Card className="wellness-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-wellness-green rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Relaxation Audio</h3>
                    <p className="text-sm text-muted-foreground">Calming sounds and guided relaxation exercises</p>
                  </div>
                </div>
                <p className="text-wellness-green text-sm mb-2">8 tracks</p>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-primary">
                  Listen →
                </Button>
              </CardContent>
            </Card>
            
            <Card className="wellness-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-wellness-pink rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Self-Help Guides</h3>
                    <p className="text-sm text-muted-foreground">Practical strategies for managing college stress</p>
                  </div>
                </div>
                <p className="text-primary text-sm mb-2">15 guides</p>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-primary">
                  Read →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="px-6 py-16 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Safe & Supportive Community</h2>
            <p className="text-muted-foreground">Connect with fellow students who understand your journey</p>
          </div>
          
          <Card className="wellness-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-wellness-green" />
                <div className="bg-wellness-green text-white px-3 py-1 rounded-full text-sm font-medium">
                  Safe & Moderated Space
                </div>
                <span className="text-sm text-muted-foreground">• Anonymous posting • 24/7 moderation • Supportive community guidelines</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    AS
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">Anonymous Student</span>
                      <span className="text-xs text-muted-foreground">2h ago</span>
                    </div>
                    <p className="text-sm mb-2">
                      Just wanted to share that the breathing exercises from the app really helped during my 
                      presentation anxiety. Thank you to everyone who suggested them! 💙
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> 12 
                      </span>
                      <span>Reply</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    CB
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">College Buddy</span>
                      <span className="text-xs text-muted-foreground">3h ago</span>
                    </div>
                    <p className="text-sm mb-2">
                      Finals week is approaching and I'm feeling overwhelmed. Any tips for managing study stress?
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> 8
                      </span>
                      <span>Reply (5)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button className="bg-primary hover:bg-primary/90" asChild>
                  <Link to="/community">Join Our Community</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter/>
    </div>
  );
};

export default Landing;