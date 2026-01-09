import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/config/api";
import { useNavigate } from "react-router-dom";


export default function StudentProgress() {

  const navigate = useNavigate();

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      console.debug('Requesting users from:', api.defaults.baseURL + '/users');
      const res = await api.get('/users');
      setStudents(res.data || []);
    } catch (err) {
      console.error('Failed to fetch students', err?.response || err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError('You are not authorized. Please log in as a counsellor.');
        // Optionally redirect to login:
        // window.location.href = '/login';
      } else if (status === 404) {
        setError('User list not found on server (404). Check backend is running and route /users is available.');
      } else {
        setError('Could not load students');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Student Progress</h1>
        <p className="text-muted-foreground mb-6">Overview of tracked student wellness progress.</p>

        {loading ? (
          <div className="p-6 text-center text-muted-foreground">Loading students...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
           {students.map((s) => (
  <Card
    key={s._id}
    className="p-4 cursor-pointer hover:shadow-md transition"
    onClick={() => navigate(`/students/${s._id}`)}
  >
    <CardContent className="flex items-center justify-between gap-4">
      <div>
        <div className="font-medium">{s.fullName || s.username}</div>
        <div className="text-sm text-muted-foreground">
          {s.university || s.email}
        </div>
      </div>

      <div className="w-56">
        <Progress value={s.progress} className="h-2" />
        <div className="text-sm mt-2">{s.progress}%</div>
      </div>
    </CardContent>
  </Card>
))}

          </div>
        )}
      </main>
    </div>
  );
}
