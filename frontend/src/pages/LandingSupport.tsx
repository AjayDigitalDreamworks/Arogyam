import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, Clock, Shield, Heart, ArrowLeft, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import LandingFooter from "@/components/LandingFooter";

const LandingSupport = () => {
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
            <Link to="/landing-resources" className="text-muted-foreground hover:text-primary transition-colors">Resources</Link>
            <Link to="/landing-support" className="text-primary font-medium border-b-2 border-primary pb-1">Support</Link>
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
          <h1 className="text-4xl font-bold mb-4">Get Support When You Need It</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Multiple ways to get help, available 24/7. You're never alone in your journey.
          </p>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold text-red-800 dark:text-red-200">Crisis Support</h2>
              </div>
              <p className="text-red-700 dark:text-red-300 mb-6">
                If you're in immediate danger or having thoughts of self-harm, please reach out for help immediately.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="bg-red-600 hover:bg-red-700 text-white" size="lg" asChild>
                  <a href="tel:988">
                    <Phone className="w-5 h-5 mr-2" />
                    Call 988 - Crisis Lifeline
                  </a>
                </Button>
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300" size="lg" asChild>
                  <a href="tel:911">
                    <Phone className="w-5 h-5 mr-2" />
                    Call 911 - Emergency
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Support Options */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How We Can Help</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Chat Support */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white dark:text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Chat Assistant</h3>
                <p className="text-muted-foreground mb-6">
                  Get instant support from our AI assistant trained specifically for student mental health concerns.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Available 24/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Completely confidential</span>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link to="/dashboard">Start Chat Now</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Professional Counseling */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Professional Counseling</h3>
                <p className="text-muted-foreground mb-6">
                  Schedule sessions with licensed mental health professionals who understand student challenges.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Flexible scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Licensed professionals</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/landing-booking">Book Session</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Peer Support */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Peer Support Groups</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with other students who understand what you're going through in moderated support groups.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Regular group sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Moderated environment</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/dashboard">Join Community</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Is my information confidential?</h3>
                <p className="text-muted-foreground">
                  Yes, absolutely. All conversations and sessions are completely confidential and protected by privacy laws. 
                  We only share information if there's an immediate safety concern.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How quickly can I get help?</h3>
                <p className="text-muted-foreground">
                  Our AI assistant is available 24/7 for immediate support. Professional counseling sessions can typically 
                  be scheduled within 24-48 hours, with emergency slots available if needed.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What if I'm not sure I need help?</h3>
                <p className="text-muted-foreground">
                  It's completely normal to feel uncertain. Our AI assistant can help you assess your situation and 
                  determine what level of support might be helpful. There's no commitment required to start a conversation.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Is this service free?</h3>
                <p className="text-muted-foreground">
                  Our AI assistant and basic resources are completely free. Professional counseling sessions may have 
                  associated costs, but we work with most insurance providers and offer sliding scale options.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Still Have Questions?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our support team is here to help you find the right resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/dashboard">Chat with AI Assistant</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="mailto:support@mindwell.app">Email Support Team</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter/>
    </div>
  );
};

export default LandingSupport;