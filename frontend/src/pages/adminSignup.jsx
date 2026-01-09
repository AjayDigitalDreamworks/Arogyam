import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/config/api";
import { Link } from 'react-router-dom';


export default function AdminSignup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/admin/register", {
        name,
        username,
        password,
      });

      window.location.href = "/admin/login";
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700">
      <Card className="w-full max-w-md animate-fadeIn">
        <CardContent className="p-6 space-y-5">
          <h1 className="text-2xl font-bold text-center">Admin Signup</h1>
          <p className="text-sm text-center text-muted-foreground">
            Create new admin account
          </p>

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Username"
              className="w-full border rounded px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition"
            >
              {loading ? "Creating..." : "Create Admin"}
            </button>
             <Link to="/admin/login" className="text-sm text-center text-blue-500 hover:underline block">
                           have an account? Login now
                        </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
