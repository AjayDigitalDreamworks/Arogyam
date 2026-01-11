import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  role: "student" | "volunteer";
}

export default function Community() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ================= USER ================= */
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      const res = await axios.get(
        "https://arogyam-9rll.onrender.com/current_user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data);
    };

    fetchUser();
  }, [token]);

 
// console.log("NESTED ROLE:", user?.user?.role);


  const isVolunteer = user?.user?.role === "volunteer";

  console.log(isVolunteer);

  /* ================= COMMUNITIES ================= */
  const fetchCommunities = async () => {
    const res = await axios.get("https://arogyam-9rll.onrender.com/api/community");
    setCommunities(res.data);
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  /* ================= ACTIONS ================= */
  const joinCommunity = async (id: string) => {
    await axios.post(
      `https://arogyam-9rll.onrender.com/api/community/${id}/join`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    navigate(`/community/${id}`);
  };

 const createCommunity = async () => {
  if (!user) return;

  await axios.post(
    "https://arogyam-9rll.onrender.com/api/community/create",
    {
      ...form,
      role: user.user.role, // <-- send role from frontend
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  setOpen(false);
  setForm({ name: "", description: "" });
  fetchCommunities();
};


  /* ================= UI ================= */
  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Communities</h1>

        {/* ONLY VOLUNTEER */}
        {isVolunteer && (
          <Button onClick={() => setOpen(true)}>
            Create Community
          </Button>
        )}
      </div>

      {/* COMMUNITY LIST */}
      <div className="grid md:grid-cols-2 gap-6">
        {communities.map((c: any) => (
          <Card key={c._id} className="p-6">
            <h2 className="font-semibold text-lg">{c.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {c.description}
            </p>

            <Button size="sm" onClick={() => joinCommunity(c._id)}>
              Open / Join
            </Button>
          </Card>
        ))}
      </div>

      {/* CREATE COMMUNITY MODAL */}
      {isVolunteer && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogTitle>Create Community</DialogTitle>

            <Input
              placeholder="Community Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <Button onClick={createCommunity}>
              Create
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
