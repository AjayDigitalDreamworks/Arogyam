import React, { useState , useEffect} from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import API_BASE_URL from "@/config/api";

export default function Appointments() {
  const [counselors, setCounselors] = useState([]);
  useEffect(() => {
    axios.get(`${API_BASE_URL}/counselors`)
      .then(response => {
        console.log('Fetched counselors:', response.data);
        setCounselors(response.data);
      })
      .catch(error => {
        console.error('Error fetching counselors:', error);
      });
  }, []);
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    concerns: ''
  });
  const { toast } = useToast();

  const handleBooking = async () => {
    if (!selectedCounselor || !selectedDate || !selectedTime || !appointmentType || !formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const appointmentPayload = {
      counselorId: selectedCounselor,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
      discussion: formData.concerns
    };

    try {
      const response = await axios.post(`https://sih-2025-arogyam-0cf2.onrender.com/appointments`, appointmentPayload);
      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been scheduled. You'll receive a confirmation email shortly.",
      });
      // Reset form
      setSelectedCounselor('');
      setSelectedDate('');
      setSelectedTime('');
      setAppointmentType('');
      setFormData({ name: '', email: '', phone: '', concerns: '' });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book Counseling Appointment</h1>
        <p className="text-muted-foreground">
          Schedule a session with our professional counselors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Counselor Selection */}
          <Card className="wellness-card p-6">
            <h3 className="text-lg font-semibold mb-4">Choose Your Counselor</h3>
            <div className="grid gap-4">
              {counselors.map((counselor) => (
                <div
                  key={counselor._id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCounselor === counselor._id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedCounselor(counselor._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{counselor.image}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{counselor.name}</h4>
                      <p className="text-sm text-muted-foreground">{counselor.specialty}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm">⭐ {counselor.rating}</span>
                        <span className="text-sm text-muted-foreground">{counselor.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Date & Time Selection */}
          <Card className="wellness-card p-6">
            <h3 className="text-lg font-semibold mb-4">Select Date & Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Appointment Type */}
          <Card className="wellness-card p-6">
            <h3 className="text-lg font-semibold mb-4">Appointment Type</h3>
            <Select value={appointmentType} onValueChange={setAppointmentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual Counseling (50 min)</SelectItem>
                <SelectItem value="group">Group Therapy (90 min)</SelectItem>
                <SelectItem value="crisis">Crisis Intervention (Emergency)</SelectItem>
                <SelectItem value="consultation">Initial Consultation (30 min)</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          {/* Contact Information */}
          <Card className="wellness-card p-6">
            <h3 className="text-lg font-semibold mb-4">Your Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@college.edu"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="concerns">What would you like to discuss?</Label>
                <Textarea
                  id="concerns"
                  value={formData.concerns}
                  onChange={(e) => setFormData(prev => ({ ...prev, concerns: e.target.value }))}
                  placeholder="Briefly describe what you'd like to talk about (optional)"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          <Button onClick={handleBooking} className="w-full" size="lg">
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card className="wellness-card p-6">
            <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm">(555) 123-HELP</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm">counseling@college.edu</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">Student Health Center, Room 204</span>
              </div>
            </div>
          </Card>

          {/* Guidelines */}
          <Card className="wellness-card p-6">
            <h3 className="text-lg font-semibold mb-4">Guidelines</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Please arrive 10 minutes early</li>
              <li>• Bring your student ID</li>
              <li>• Sessions are completely confidential</li>
              <li>• Cancel at least 24 hours in advance</li>
              <li>• Emergency support available 24/7</li>
            </ul>
          </Card>

          {/* Crisis Support */}
          <Card className="wellness-card p-6 border-red-200 bg-red-50/50">
            <h3 className="text-lg font-semibold mb-2 text-red-700">Crisis Support</h3>
            <p className="text-sm text-red-600 mb-3">
              If you're experiencing a mental health emergency, don't wait for an appointment.
            </p>
            <Button variant="destructive" className="w-full" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Call Crisis Line: 988
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}