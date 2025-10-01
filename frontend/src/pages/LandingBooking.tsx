import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, Shield, Heart, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import API_BASE_URL from "@/config/api";
import LandingFooter from "@/components/LandingFooter";

const LandingBooking = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedCounselor, setSelectedCounselor] = useState<string>("");

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", 
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const counselors = [
    { id: "1", name: "Dr. Sarah Johnson", specialty: "Anxiety & Stress", available: true },
    { id: "2", name: "Dr. Michael Chen", specialty: "Depression & Mood", available: true },
    { id: "3", name: "Dr. Emily Rodriguez", specialty: "Academic Pressure", available: false },
    { id: "4", name: "Dr. David Kim", specialty: "Social Anxiety", available: true },
  ];

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
            <Link to="/landing-support" className="text-muted-foreground hover:text-primary transition-colors">Support</Link>
            <Link to="/landing-booking" className="text-primary font-medium border-b-2 border-primary pb-1">Book Session</Link>
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
          <h1 className="text-4xl font-bold mb-4">Book Your Counseling Session</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Schedule a confidential session with one of our licensed mental health professionals
          </p>
        </div>
      </section>

      {/* Booking Process */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Booking Form */}
            <div className="space-y-8">
              {/* Step 1: Select Counselor */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white dark:text-black  font-bold">1</div>
                    <h3 className="text-xl font-semibold">Choose Your Counselor</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {counselors.map((counselor) => (
                      <div
                        key={counselor.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedCounselor === counselor.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground"
                        } ${!counselor.available ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => counselor.available && setSelectedCounselor(counselor.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium">{counselor.name}</p>
                              <p className="text-sm text-muted-foreground">{counselor.specialty}</p>
                            </div>
                          </div>
                          {counselor.available ? (
                            <span className="text-green-600 text-sm font-medium">Available</span>
                          ) : (
                            <span className="text-muted-foreground text-sm">Unavailable</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Select Date */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white dark:text-black font-bold">2</div>
                    <h3 className="text-xl font-semibold">Select Date</h3>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {/* Calendar placeholder - would integrate with actual calendar component */}
                    {Array.from({ length: 14 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      const dateStr = date.toISOString().split('T')[0];
                      const dayStr = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
                      
                      return (
                        <button
                          key={i}
                          className={`p-3 text-sm border rounded-lg transition-colors ${
                            selectedDate === dateStr
                              ? "border-primary bg-primary text-white"
                              : "border-border hover:border-muted-foreground"
                          }`}
                          onClick={() => setSelectedDate(dateStr)}
                        >
                          {dayStr}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Select Time */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white dark:text-black font-bold">3</div>
                    <h3 className="text-xl font-semibold">Choose Time</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        className={`p-3 text-sm border rounded-lg transition-colors ${
                          selectedTime === time
                            ? "border-primary bg-primary text-white"
                            : "border-border hover:border-muted-foreground"
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="space-y-8">
              {/* Session Information */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Session Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Completely Confidential</p>
                        <p className="text-sm text-muted-foreground">All sessions are private and secure</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">50-Minute Session</p>
                        <p className="text-sm text-muted-foreground">Standard counseling session length</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Flexible Scheduling</p>
                        <p className="text-sm text-muted-foreground">Easy to reschedule if needed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Summary */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Booking Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Counselor:</span>
                      <span className="font-medium">
                        {selectedCounselor ? 
                          counselors.find(c => c.id === selectedCounselor)?.name : 
                          "Not selected"
                        }
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">
                        {selectedDate ? 
                          new Date(selectedDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 
                          "Not selected"
                        }
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">{selectedTime || "Not selected"}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">50 minutes</span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span>$75.00</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Most insurance plans accepted
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-primary hover:bg-primary/90" 
                    size="lg"
                    disabled={!selectedCounselor || !selectedDate || !selectedTime}
                    asChild
                  >
                    <Link to="/dashboard">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirm Booking
                    </Link>
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By booking, you agree to our terms of service and privacy policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Book with Arogyam?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white dark:text-black" />
              </div>
              <h3 className="font-semibold mb-2">Licensed Professionals</h3>
              <p className="text-sm text-muted-foreground">
                All our counselors are licensed mental health professionals
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white dark:text-black" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Book sessions that work with your academic schedule
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white dark:text-black" />
              </div>
              <h3 className="font-semibold mb-3">Student-Focused</h3>
              <p className="text-sm text-muted-foreground">
                Specialized in college student mental health challenges
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter/>
    </div>
  );
};

export default LandingBooking;