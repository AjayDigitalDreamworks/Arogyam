import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import api from "@/config/api";

/* ---------------- helpers ---------------- */

const average = (arr: number[]) =>
  arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

/* ---------------- reusable components ---------------- */

function AnimatedProgressCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number;
  subtitle?: string;
}) {
  return (
    <div className="transition-all duration-500 ease-out hover:scale-[1.02]">
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">{title}</h2>
            <span className="font-bold">{value}%</span>
          </div>

          <Progress
            value={value}
            className="h-3 transition-all duration-1000"
          />

          {subtitle && (
            <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  progress,
}: {
  title: string;
  value: string | number;
  progress: number;
}) {
  return (
    <div className="transition-all duration-300 hover:translate-y-[-4px]">
      <Card>
        <CardContent className="p-5 space-y-2">
          <h2 className="font-semibold">{title}</h2>
          <div className="text-2xl font-bold">{value}</div>
          <Progress
            value={progress}
            className="h-2 transition-all duration-700"
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- main component ---------------- */

export default function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get(`api/counsellor/student/${id}`);
        setStudent(res.data);
      } catch (err) {
        console.error("Failed to load student", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading)
    return <div className="p-8 text-muted-foreground">Loading student...</div>;

  if (!student)
    return <div className="p-8 text-red-500">Student not found</div>;

  /* -------- data calculations -------- */

  const sleepAvg = average(
    student.sleepHistory?.map((s: any) => s.hours) || []
  );

  const moodAvg = average(
    student.moodHistory?.map((m: any) => m.score) || []
  );

  const quizAvg = average(
    student.quizScores?.map((q: any) => q.score) || []
  );

  const overallProgress = Math.round(
    (sleepAvg * 10 + moodAvg + quizAvg) / 3
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background animate-fadeIn">
      <main className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 animate-slideDown">
          <div className="text-5xl">{student.avatar || "🎓"}</div>
          <div>
            <h1 className="text-2xl font-bold">{student.fullName}</h1>
            <p className="text-muted-foreground">
              {student.university} • {student.yearOfStudy}
            </p>
            <p className="text-sm text-muted-foreground">
              {student.email} • {student.phone}
            </p>
          </div>
        </div>

        {/* Overall */}
        <AnimatedProgressCard
          title="Overall Wellness Progress"
          value={overallProgress}
          subtitle="Combined sleep, mood & academic performance"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Average Sleep"
            value={`${sleepAvg} hrs`}
            progress={sleepAvg * 10}
          />

          <StatCard
            title="Mood Score"
            value={moodAvg}
            progress={moodAvg}
          />

          <StatCard
            title="Academic Score"
            value={quizAvg}
            progress={quizAvg}
          />
        </div>

        {/* Meta */}
        <Card>
          <CardContent className="p-5 text-sm text-muted-foreground">
            Profile created on{" "}
            {new Date(student.createdAt).toLocaleDateString()}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
