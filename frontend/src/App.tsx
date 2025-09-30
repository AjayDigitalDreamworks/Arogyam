import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
         <BrowserRouter>
          <Routes>
            {/* Landing pages (pre-login) */}
            <Route path="/" element={<Landing />} />
            <Route path="/landing-resources" element={<LandingResources />} />
            <Route path="/landing-support" element={<LandingSupport />} />
            <Route path="/landing-booking" element={<LandingBooking />} />
            
            {/* Dashboard pages (post-login) */}
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

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        {/* <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/community" element={<Community />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/mood" element={<Mood />} />
              <Route path="/sleep" element={<Sleep />} />
              <Route path="/exercise" element={<Exercise />} />
              <Route path="/crisis" element={<Crisis />} />
              <Route path="/feedback" element={<Feedback />} />

              ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter> */}
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
