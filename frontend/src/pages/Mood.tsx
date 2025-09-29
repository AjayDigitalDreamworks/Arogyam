import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  Heart, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  BarChart3,
  Plus,
  Filter,
  Download,
  Share2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const moods = [
  { emoji: "😭", label: "Very Sad", value: 1, color: "bg-red-500" },
  { emoji: "😞", label: "Sad", value: 2, color: "bg-orange-500" },
  { emoji: "😐", label: "Neutral", value: 3, color: "bg-yellow-500" },
  { emoji: "😊", label: "Good", value: 4, color: "bg-green-500" },
  { emoji: "😍", label: "Great", value: 5, color: "bg-green-600" },
];

const moodHistory = [
  { date: '2024-01-15', mood: 4, note: 'Had a great study session with friends!' },
  { date: '2024-01-14', mood: 3, note: 'Feeling okay, but a bit stressed about upcoming exam.' },
  { date: '2024-01-13', mood: 5, note: 'Amazing day! Got good news about internship.' },
  { date: '2024-01-12', mood: 2, note: 'Feeling down, homesick today.' },
  { date: '2024-01-11', mood: 4, note: 'Good productive day, worked out in the morning.' },
  { date: '2024-01-10', mood: 3, note: 'Average day, nothing special happened.' },
  { date: '2024-01-09', mood: 4, note: 'Nice weather, spent time outdoors.' },
];

const weeklyData = [
  { day: 'Mon', mood: 3, color: 'bg-yellow-500' },
  { day: 'Tue', mood: 2, color: 'bg-orange-500' },
  { day: 'Wed', mood: 4, color: 'bg-green-500' },
  { day: 'Thu', mood: 5, color: 'bg-green-600' },
  { day: 'Fri', mood: 4, color: 'bg-green-500' },
  { day: 'Sat', mood: 3, color: 'bg-yellow-500' },
  { day: 'Sun', mood: 4, color: 'bg-green-500' },
];

const monthlyInsights = {
  averageMood: 3.7,
  bestDay: 'Thursday',
  mostCommonMood: 'Good 😊',
  improvementTrend: '+12%',
  totalEntries: 28
};

export default function Mood() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleMoodSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling today.",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/mood", {
        mood: selectedMood,
        note: moodNote,
        date: selectedDate || new Date()
      });
      toast({
        title: "Mood Recorded!",
        description: "Your mood has been saved to your wellness journey.",
      });
      setSelectedMood(null);
      setMoodNote('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save your mood. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getMoodColor = (value: number) => {
    const mood = moods.find(m => m.value === value);
    return mood?.color || 'bg-gray-500';
  };

  const getMoodEmoji = (value: number) => {
    const mood = moods.find(m => m.value === value);
    return mood?.emoji || '😐';
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mood Tracker</h1>
        <p className="text-muted-foreground">
          Track your emotional wellness journey and discover patterns in your mental health
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Mood Entry */}
          <Card className="wellness-card p-6">
            <h3 className="text-lg font-semibold mb-4">How are you feeling today?</h3>
            
            <div className="flex justify-between gap-2 mb-6">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`
                    mood-selector flex flex-col items-center p-4 min-w-0 flex-1 rounded-lg border-2 transition-all
                    ${selectedMood === mood.value 
                      ? 'border-primary bg-primary/10 scale-105' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  <span className="text-3xl mb-2">{mood.emoji}</span>
                  <span className="text-xs font-medium text-center leading-tight">
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What's on your mind? (Optional)
                </label>
                <Textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="Share what's contributing to your mood today..."
                  rows={3}
                />
              </div>
              
              <Button onClick={handleMoodSubmit} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Record Today's Mood
              </Button>
            </div>
          </Card>

          {/* Mood Analytics */}
          <Tabs defaultValue="weekly" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weekly">This Week</TabsTrigger>
              <TabsTrigger value="monthly">This Month</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly" className="space-y-6">
              <Card className="wellness-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Weekly Mood Trend</h3>
                  <Badge variant="secondary">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Improving
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-end gap-2 h-32">
                    {weeklyData.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-muted rounded-sm relative mb-2"
                          style={{ height: '100px' }}
                        >
                          <div 
                            className={`absolute bottom-0 left-0 right-0 ${item.color} rounded-sm transition-all`}
                            style={{ height: `${(item.mood / 5) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs font-medium">{item.day}</div>
                        <div className="text-lg">{getMoodEmoji(item.mood)}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold">3.6</div>
                      <div className="text-xs text-muted-foreground">Avg Mood</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">4</div>
                      <div className="text-xs text-muted-foreground">Best Day</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">7</div>
                      <div className="text-xs text-muted-foreground">Days Tracked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">+8%</div>
                      <div className="text-xs text-muted-foreground">vs Last Week</div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-6">
              <Card className="wellness-card p-6">
                <h3 className="text-lg font-semibold mb-4">Monthly Insights</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {monthlyInsights.averageMood}
                    </div>
                    <div className="text-sm text-muted-foreground">Average Mood</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {monthlyInsights.bestDay}
                    </div>
                    <div className="text-sm text-muted-foreground">Best Day</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {monthlyInsights.improvementTrend}
                    </div>
                    <div className="text-sm text-muted-foreground">Improvement</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl mb-1">😊</div>
                    <div className="text-sm text-muted-foreground">Most Common</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {monthlyInsights.totalEntries}
                    </div>
                    <div className="text-sm text-muted-foreground">Entries</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">93%</div>
                    <div className="text-sm text-muted-foreground">Consistency</div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="wellness-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Mood History</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {moodHistory.map((entry, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50">
                      <div className="flex flex-col items-center">
                        <div className="text-2xl mb-1">{getMoodEmoji(entry.mood)}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {moods.find(m => m.value === entry.mood)?.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString('en-US', { 
                              weekday: 'long'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Calendar */}
          <Card className="wellness-card p-6">
            <h3 className="text-lg font-semibold mb-4">Mood Calendar</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0"
            />
          </Card>

          {/* Quick Stats */}
          <Card className="wellness-card p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Current Streak</span>
                <span className="font-semibold">12 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="font-semibold">28 entries</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg Rating</span>
                <span className="font-semibold">3.7/5</span>
              </div>
            </div>
          </Card>

          {/* Mood Patterns */}
          <Card className="wellness-card p-6">
            <h3 className="text-lg font-semibold mb-4">Patterns</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium mb-1">Best Time</div>
                <div className="text-xs text-muted-foreground">Mornings (8-10 AM)</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Challenging Day</div>
                <div className="text-xs text-muted-foreground">Mondays</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Mood Booster</div>
                <div className="text-xs text-muted-foreground">Exercise & Friends</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}