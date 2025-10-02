import React, { useState , useEffect} from "react";
import { Moon, Clock, TrendingUp, Calendar, Star, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import api from "@/config/api";

export default function Sleep() {
  const [sleepHours, setSleepHours] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState(4);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logHours, setLogHours] = useState("");
  const [logQuality, setLogQuality] = useState(3);

  const sleepData = [
    { date: "Mon", hours: 8, quality: 5 },
    { date: "Tue", hours: 7, quality: 3 },
    { date: "Wed", hours: 6.5, quality: 3 },
    { date: "Thu", hours: 8.5, quality: 5 },
    { date: "Fri", hours: 6, quality: 2 },
    { date: "Sat", hours: 9, quality: 5 },
    { date: "Sun", hours: 7.5, quality: 4 },
  ];

  const sleepTips = [
    "Maintain a consistent sleep schedule",
    "Create a relaxing bedtime routine",
    "Keep your bedroom cool and dark",
    "Avoid screens 1 hour before bed",
    "Limit caffeine after 2 PM"
  ];
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const { toast } = useToast();
  useEffect(() => {
    api.get(`/protected`)
      .then((response) => {
        console.log("Fetched user:", response.data.user);
        setUser(response.data.user);
        setUserId(response.data.user.userId); // Assuming the user ID is available here
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

 const handleLogSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const hours = Number(logHours);

  setSleepHours(hours);
  setSleepQuality(logQuality);

  // Call backend submit function
  await handleSleepSubmit(hours, new Date());

  setShowLogModal(false);
  setLogHours("");
  setLogQuality(3);
};


  const handleSleepSubmit = async (hours: number, sleepDate: Date) => {
    if (!userId) {
      toast({
        title: "User not found",
        description: "Please log in again.",
        variant: "destructive",
      });
      return;
    }
    try {
      await api.post(`/api/sleep`, {
        userId,
        hours,
        quality: sleepQuality, // <-- add this
        date: sleepDate || new Date()
      });
      toast({
        title: "Sleep Recorded!",
        description: "Your sleep data has been saved to your wellness journey.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save your sleep data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-wellness-blue flex items-center justify-center">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Sleep Tracker</h1>
          </div>
          <p className="text-muted-foreground">Monitor your sleep patterns and improve your rest quality</p>
        </div>

        {/* Today's Sleep Card */}
        <Card className="mb-8 gradient-subtle border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Last Night's Sleep
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{sleepHours}h</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= sleepQuality ? "text-wellness-yellow fill-current" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">Quality Rating</div>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="text-sm">
                  Good Sleep
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">Based on duration & quality</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sleep History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Weekly Sleep Pattern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sleepData.map((day) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 text-sm font-medium">{day.date}</div>
                      <div className="flex-1">
                        <Progress value={(day.hours / 10) * 100} className="h-2" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{day.hours}h</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= day.quality ? "text-wellness-yellow fill-current" : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sleep Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Better Sleep Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sleepTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sleep Goals */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Sleep Goals & Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-wellness-green/10">
                <div className="text-2xl font-bold text-wellness-green mb-1">8h</div>
                <div className="text-sm text-muted-foreground">Recommended</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <div className="text-2xl font-bold text-primary mb-1">7.2h</div>
                <div className="text-sm text-muted-foreground">Weekly Average</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-wellness-orange/10">
                <div className="text-2xl font-bold text-wellness-orange mb-1">85%</div>
                <div className="text-sm text-muted-foreground">Goal Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Log Sleep Button */}
        <div className="text-center">
          <Button
            className="gradient-primary text-white px-8 py-3"
            onClick={() => setShowLogModal(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Log Last Night's Sleep
          </Button>
        </div>

        {/* Log Sleep Modal */}
        <Dialog open={showLogModal} onOpenChange={setShowLogModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Last Night's Sleep</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Hours Slept</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.1"
                  value={logHours}
                  onChange={e => setLogHours(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Sleep Quality</label>
                <select
                  value={logQuality}
                  onChange={e => setLogQuality(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                >
                  {[1,2,3,4,5].map(q => (
                    <option key={q} value={q}>{q} Star{q > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}