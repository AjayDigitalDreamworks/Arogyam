import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MindWellSidebar } from "@/components/MindWellSidebar";
import { CounsellorSidebar } from "@/components/CounsellorSidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Bell, Search, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/config/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
} 

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Choose sidebar by route: counsellor routes use the counsellor sidebar */}
        {(() => {
          const location = useLocation();
          const path = location.pathname || "";
          if (path.startsWith("/counsellor")) return <CounsellorSidebar />;
          if (path.startsWith("/admin")) return <AdminSidebar />;
          return <MindWellSidebar />;
        })()}

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger /> {/* className="md:hidden" */}
                <div className="hidden sm:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search resources, articles..."
                      className="pl-10 pr-4 py-2 bg-muted rounded-lg border border-border w-96 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <ThemeToggle />

                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
                </Button>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">
                      {localStorage.getItem('userName') || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {localStorage.getItem('userEmail') || 'User'}
                     
                    </p>
                  </div>
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Logout Button */}
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={async () => {
                      try {
                        await api.post('/api/auth/logout');
                      } catch (e) {
                        // ignore server errors
                      } finally {
                        localStorage.removeItem('token');
                        toast({ title: 'Logged out', description: 'You have been logged out.' });
                        navigate('/login');
                      }
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

// import React from "react";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { MindWellSidebar } from "@/components/MindWellSidebar";
// import AppHeader from "@/components/AppHeader";

// interface LayoutProps {
//   children: React.ReactNode;
// }

// export function Layout({ children }: LayoutProps) {
//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex flex-col bg-background w-full">
//         {/* Full-width Navbar at top */}
//         <header className="w-full z-10">
//           <AppHeader />
//         </header>

//         {/* Below navbar: sidebar left + main content right */}
//         <div className="flex flex-1 min-h-0">
//           {/* Sidebar on left below navbar */}
//           <aside className="w-64 border-r border-border bg-card overflow-auto">
//             {/* <MindWellSidebar /> */}
//           </aside>

//           {/* Main content area on right */}
//           <main className="flex-1 overflow-auto min-w-0 p-6">
//             {children}
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// }
