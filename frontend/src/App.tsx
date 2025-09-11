import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
           
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
