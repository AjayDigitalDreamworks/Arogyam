import React, { useState, useEffect } from "react";
import { Heart, Moon, GraduationCap, Flame } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { WellnessCard } from "@/components/WellnessCard";
import { QuickActions } from "@/components/QuickActions";
import { CommunityHighlights } from "@/components/CommunityHighlights";
import { WellnessJourney } from "@/components/WellnessJourney";
import { WellnessTip } from "@/components/WellnessTip";
import { EmergencySupport } from "@/components/EmergencySupport";
import { UpcomingAppointments } from "@/components/UpcomingAppointments";
import { LatestResources } from "@/components/LatestResources";
import api from "@/config/api";

const cloudinaryBase = "https://res.cloudinary.com/dlpyvzfis/video/upload/";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [wellnessData, setWellnessData] = useState<any[]>([]);
  const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
  const [resourcesData, setResourcesData] = useState({
    videos: [],
    guides: [],
    exercises: [],
  });
  const [communitiesData, setCommunitiesData] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found, please log in again.");
      window.location.href = "/login";
      return;
    }

    // Fetch dashboard + resources + communities in parallel
    const fetchDashboard = async () => {
      try {
        // Dashboard data
        const res = await api.get("/users/dashboard");
        const { user, latestMood, latestSleep, upcomingAppointments, quizScores } = res.data;
        setUser(user);
        setAppointmentsData(upcomingAppointments || []);

        // Wellness cards
        const moodProgress = latestMood ? Math.round((latestMood.mood / 5) * 100) : 0;
        const sleepProgress = latestSleep ? Math.round(Math.min(100, (latestSleep.hours / 8) * 100)) : 0;
        const studyStress =
          quizScores && quizScores.length ? Math.round(Math.min(100, quizScores[0].score || 50)) : 50;

        const streak = (() => {
          if (!user?.moodHistory?.length) return 0;
          const sorted = [...user.moodHistory].sort(
            (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          let curr = new Date();
          let streakCount = 0;
          for (const entry of sorted) {
            const entryDate = new Date(entry.date);
            const diffDays = Math.floor(
              (curr.setHours(0, 0, 0, 0) - new Date(entryDate).setHours(0, 0, 0, 0)) /
                (1000 * 60 * 60 * 24)
            );
            if (diffDays === streakCount && entry.mood >= 3) streakCount += 1;
            else if (diffDays > streakCount) break;
          }
          return streakCount;
        })();

        setWellnessData([
          {
            title: "Mood Today",
            subtitle: latestMood ? `Mood ${latestMood.mood}` : "No data",
            icon: Heart,
            iconBgColor: "bg-wellness-green",
            progress: moodProgress,
            progressColor: "green",
            emoji: "💚",
          },
          {
            title: "Sleep Quality",
            subtitle: latestSleep ? `${latestSleep.hours} hrs` : "No data",
            icon: Moon,
            iconBgColor: "bg-wellness-blue",
            progress: sleepProgress,
            progressColor: "blue",
            emoji: "🌙",
          },
          {
            title: "Study Stress",
            subtitle: `${studyStress}%`,
            icon: GraduationCap,
            iconBgColor: "bg-wellness-orange",
            progress: studyStress,
            progressColor: "orange",
            emoji: "🎓",
          },
          {
            title: "Streak",
            subtitle: `${streak} days`,
            icon: Flame,
            iconBgColor: "bg-wellness-yellow",
            progress: Math.min(100, streak),
            progressColor: "yellow",
            emoji: "🔥",
          },
        ]);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          setError("Failed to load dashboard");
        }
      }
    };

    const fetchResources = async () => {
      try {
        const res = await api.get("/hub");
        const data = res.data;
        console.log("Fetched hub resources:", data);
        setResourcesData({
          videos: data.videos || [],
          guides: data.guides || [],
          exercises: data.exercises || [],
        });
      } catch (err) {
        console.error("Error fetching resources:", err);
      }
    };

    const fetchCommunities = async () => {
      try {
        const res = await api.get("/api/community");
        setCommunitiesData(res.data?.communities || []);
      } catch (err) {
        console.error("Error fetching communities:", err);
      }
    };

    fetchDashboard();
    fetchResources();
    fetchCommunities();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Hero Section */}
        <HeroSection userName={user?.username || "User"} />

        {/* Wellness Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {wellnessData.map((data) => (
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

        {/* Upcoming Appointments */}
        <div className="mb-8">
          <UpcomingAppointments appointments={appointmentsData} />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Latest Resources */}
        <div className="mb-8">
          {/* <LatestResources resources={resourcesData.videos} /> */}
          <LatestResources
  resources={[
    ...(resourcesData.videos || []),
    ...(resourcesData.guides || []),
    ...(resourcesData.exercises || [])
  ]}
/>

        </div>

        {/* Community + Wellness Sections */}
        <div className="mb-8">
          <CommunityHighlights communities={communitiesData} />
          <div className="mb-8">
            <WellnessTip />
          </div>
          <div className="mb-8">
            <WellnessJourney />
          </div>
          <div>
            <EmergencySupport />
          </div>
        </div>
      </main>
    </div>
  );
}
