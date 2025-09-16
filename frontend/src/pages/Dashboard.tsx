import React from "react";
import { Heart, Moon, GraduationCap, Flame } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { WellnessCard } from "@/components/WellnessCard";
import { MoodTracker } from "@/components/MoodTracker";
import { QuickActions } from "@/components/QuickActions";
import { CommunityHighlights } from "@/components/CommunityHighlights";
import { WellnessJourney } from "@/components/WellnessJourney";
import { WellnessTip } from "@/components/WellnessTip";
import { EmergencySupport } from "@/components/EmergencySupport";
import { UpcomingAppointments } from "@/components/UpcomingAppointments";
import { LatestResources } from "@/components/LatestResources";

const wellnessData = [
  {
    title: "Mood Today",
    subtitle: "Good - Keep it up!",
    icon: Heart,
    iconBgColor: "bg-wellness-green",
    progress: 85,
    progressColor: "green",
    emoji: "💚",
  },
  {
    title: "Sleep Quality",
    subtitle: "7.5 hours last night",
    icon: Moon,
    iconBgColor: "bg-wellness-blue",
    progress: 75,
    progressColor: "blue",
    emoji: "🌙",
  },
  {
    title: "Study Stress",
    subtitle: "Moderate level",
    icon: GraduationCap,
    iconBgColor: "bg-wellness-orange",
    progress: 60,
    progressColor: "orange",
    emoji: "🎓",
  },
  {
    title: "Streak",
    subtitle: "12 days checking in",
    icon: Flame,
    iconBgColor: "bg-wellness-yellow",
    progress: 100,
    progressColor: "yellow",
    emoji: "🔥",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Hero Section */}
        <HeroSection userName="user" />

        {/* Wellness Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {wellnessData.map((data, index) => (
            <WellnessCard
              key={data.title}
              title={data.title}
              subtitle={data.subtitle}
              icon={data.icon}
              iconBgColor={data.iconBgColor}
              progress={data.progress}
              progressColor={data.progressColor}
              emoji={data.emoji}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          Left Column - Mood Tracker
          <div className="lg:col-span-1">
            <MoodTracker />
          </div>
          
          Right Columns - Community & Journey
          <div className="lg:col-span-2 space-y-8">
            <CommunityHighlights />
            <WellnessJourney />
          </div>
        </div> */}

        <div className="mb-8">
          <MoodTracker />
        </div>
        {/* <div className="mb-8">
          <MoodTracker />
         </div> */}

        {/* Upcoming Appointments */}
        <div className="mb-8">
          <UpcomingAppointments />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

       
         {/* Latest Resources */}
        <div className="mb-8">
          <LatestResources />
        </div>

        {/* Community Highlights */}
        <div className="mb-8">
          <CommunityHighlights />
        </div>

         {/* Wellness Tip */}
        <div className="mb-8">
          <WellnessTip />
        </div>


        {/* Wellness Journey */}
        <div className="mb-8">
          <WellnessJourney />
        </div>

        {/* Emergency Support */}
        <div>
          <EmergencySupport />
        </div>
      </main>
    </div>
  );
}
