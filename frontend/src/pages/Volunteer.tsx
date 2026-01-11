import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Volunteer() {
  const [volunteers, setVolunteers] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    university: "",
    yearOfStudy: "",
    avatar: "🎓",
  });

  // FETCH DATA
  const fetchAll = async () => {
    const v = await axios.get("https://arogyam-9rll.onrender.com/api/volunteer");
 
    const s = await axios.get(
      "https://arogyam-9rll.onrender.com/api/volunteer/students"
    );

    

    setVolunteers(v.data);
    setStudents(s.data);

    //   console.log(" volunteer : ",volunteers);
    // console.log(" students : ",students);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // FORM HANDLER
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // CREATE VOLUNTEER
  const createVolunteer = async () => {
    await axios.post(
      "https://arogyam-9rll.onrender.com/api/volunteer/create",
      formData
    );
    setOpen(false);
    fetchAll();
  };

  // MAKE VOLUNTEER
  const makeVolunteer = async (id) => {
    await axios.patch(
      `https://arogyam-9rll.onrender.com/api/volunteer/${id}/set-volunteer`
    );
    fetchAll();
  };

  // REMOVE VOLUNTEER
  const removeVolunteer = async (id) => {
    await axios.patch(
      `https://arogyam-9rll.onrender.com/api/volunteer/${id}/remove-volunteer`
    );
    fetchAll();
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-5xl">

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Volunteer Management</h1>
            <p className="text-muted-foreground">
              Students & Volunteers
            </p>
          </div>
          <Button onClick={() => setOpen(true)}>Add Volunteer</Button>
        </div>

        {/* STUDENTS */}
        <h2 className="text-lg font-semibold mb-3">All Students</h2>
        <div className="space-y-3 mb-8">
          {students.map((s) => (
            <Card key={s._id}>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <div className="font-medium">{s.fullName}</div>
                  <div className="text-sm text-muted-foreground">
                    {s.email}
                  </div>
                </div>
                <Button size="sm" onClick={() => makeVolunteer(s._id)}>
                  Make Volunteer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* VOLUNTEERS */}
        <h2 className="text-lg font-semibold mb-3">Volunteers</h2>
        <div className="space-y-3">
          {volunteers.map((v) => (
            <Card key={v._id}>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <div className="font-medium">{v.fullName}</div>
                  <div className="text-sm text-muted-foreground">
                    {v.email}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeVolunteer(v._id)}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

      {/* ADD VOLUNTEER MODAL */}
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Add Volunteer</DialogTitle>
    </DialogHeader>

    <form
      onSubmit={(e) => {
        e.preventDefault();
        createVolunteer();
      }}
      className="space-y-6"
    >
      {/* USERNAME */}
      <div>
        <label className="block text-sm font-medium">Display Name *</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md"
        />
      </div>

      {/* FULL NAME */}
      <div>
        <label className="block text-sm font-medium">Full Name *</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md"
        />
      </div>

      {/* EMAIL */}
      <div>
        <label className="block text-sm font-medium">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md"
        />
      </div>

      {/* PHONE */}
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        />
      </div>

      {/* PASSWORD */}
      <div>
        <label className="block text-sm font-medium">Password *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md"
        />
      </div>

      {/* AVATAR */}
      <div>
        <label className="block text-sm font-medium">Avatar (emoji)</label>
        <input
          type="text"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        />
      </div>

      {/* UNIVERSITY */}
      <div>
        <label className="block text-sm font-medium">University</label>
        <input
          type="text"
          name="university"
          value={formData.university}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        />
      </div>

      {/* YEAR */}
      <div>
        <label className="block text-sm font-medium">Year of Study</label>
        <select
          name="yearOfStudy"
          value={formData.yearOfStudy}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        >
          <option value="">Select</option>
          <option value="Freshman">1st year</option>
          <option value="Sophomore">2nd year</option>
          <option value="Junior">3rd year</option>
          <option value="Senior">4th year</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
      >
        Save Volunteer
      </button>
    </form>
  </DialogContent>
</Dialog>


      </main>
    </div>
  );
}
