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
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Games from "./pages/Games";
import LandingResources from "./pages/LandingResources";
import LandingSupport from "./pages/LandingSupport";
import LandingBooking from "./pages/LandingBooking";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

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
            <Route path="/feedback" element={<Layout><Feedback /></Layout>} />

            {/* Catch-all for unmatched routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
