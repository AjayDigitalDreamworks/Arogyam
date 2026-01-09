import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/config/api";
import { Link } from 'react-router-dom';


export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/admin/login", {
        username,
        password,
      });

      localStorage.setItem("adminToken", res.data.token);
      window.location.href = "/admin";
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      <Card className="w-full max-w-md animate-fadeIn">
        <CardContent className="p-6 space-y-5">
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
          <p className="text-sm text-center text-muted-foreground">
            Access counsellor dashboard
          </p>

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <Link to="/admin/signup" className="text-sm text-center text-blue-500 hover:underline block">
              Don't have an account? Sign up
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
