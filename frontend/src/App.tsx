import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout"; // Make sure Layout conditionally renders Sidebar/Header
import { ThemeProvider } from "@/components/ThemeProvider";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Appointments from "./pages/Appointments";
import Resources from "./pages/Resources";
import Community from "./pages/Community";
import Quizzes from "./pages/Quizzes";
import Mood from "./pages/Mood";
import Sleep from "./pages/Sleep";
import Exercise from "./pages/Exercise";
import Crisis from "./pages/Crisis";

import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Games from "./pages/Games";
import LandingResources from "./pages/LandingResources";
import LandingSupport from "./pages/LandingSupport";
import LandingBooking from "./pages/LandingBooking";
import Signup from "./pages/Signup";
import Login from "./pages/Login";


// Counsellor pages
import CounsellorDashboard from "./pages/CounsellorDashboard";
import StudentProgress from "./pages/StudentProgress";
import Volunteer from "./pages/Volunteer";
import CounsellorResources from "./pages/CounsellorResources";
import CounsellorSignup from "./pages/CounsellorSignup";
import CounsellorLogin from "./pages/CounsellorLogin";
import CounsellorAppointments from "./pages/CounsellorAppointments";
import StudentDetails from "./pages/StudentDetails";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegisterCounsellor from "./pages/AdminRegisterCounsellor";
import AdminResources from "./pages/AdminResources";
import AdminEmergency from "./pages/AdminEmergency";
import AdminLogin from "./pages/adminLogin";
import AdminSignup from "./pages/adminSignup"


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        {/* Toaster components for notifications */}
        <Toaster />
        <Sonner />
        
        {/* Routing logic */}
        <BrowserRouter>
          <Routes>
            {/* Landing pages (pre-login) */}
            <Route path="/" element={<Landing />} />
            <Route path="/landing-resources" element={<LandingResources />} />
            <Route path="/landing-support" element={<LandingSupport />} />
            <Route path="/landing-booking" element={<LandingBooking />} />
            
            {/* Routes without Sidebar/Header (Login & Signup) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Counsellor auth (signup/login) */}
            <Route path="/counsellor/signup" element={<CounsellorSignup />} />
            <Route path="/counsellor/login" element={<CounsellorLogin />} />
            
            {/* Dashboard pages (post-login with Sidebar & Header) */}
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/chat" element={<Layout><Chat /></Layout>} />
            <Route path="/games" element={<Layout><Games /></Layout>} />
            <Route path="/appointments" element={<Layout><Appointments /></Layout>} />
            <Route path="/resources" element={<Layout><Resources /></Layout>} />
            <Route path="/community" element={<Layout><Community /></Layout>} />
            <Route path="/quizzes" element={<Layout><Quizzes /></Layout>} />
            <Route path="/mood" element={<Layout><Mood /></Layout>} />
            <Route path="/sleep" element={<Layout><Sleep /></Layout>} />
            <Route path="/exercise" element={<Layout><Exercise /></Layout>} />
            <Route path="/crisis" element={<Layout><Crisis /></Layout>} />
          

            {/* Counsellor routes */}
            <Route path="/counsellor" element={<Layout><CounsellorDashboard /></Layout>} />
            <Route path="/counsellor/student-progress" element={<Layout><StudentProgress /></Layout>} />
            <Route path="/counsellor/resources" element={<Layout><CounsellorResources /></Layout>} />
            <Route path="/counsellor/volunteer" element={<Layout><Volunteer /></Layout>} />
            <Route path="/counsellor/appointments" element={<Layout><CounsellorAppointments /></Layout>} />
            <Route path="/students/:id" element={<StudentDetails />} />

            {/* Admin routes (no auth required initially) */}
            <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/admin/register-counsellor" element={<Layout><AdminRegisterCounsellor /></Layout>} />
            <Route path="/admin/resources" element={<Layout><AdminResources /></Layout>} />
            <Route path="/admin/emergency" element={<Layout><AdminEmergency /></Layout>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />

            {/* Catch-all for unmatched routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
