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
import { jwtDecode } from "jwt-decode";

interface LayoutProps {
  children: React.ReactNode;
} 

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Notification popup state
  const [showNotifications, setShowNotifications] = React.useState(false);

  // Stateful notifications
  const [notifications, setNotifications] = React.useState([]);


  const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem("token");
    
    const decoded = jwtDecode(token);
    // console.log("Token for notifications:", decoded);
    const userId = decoded.userId;

    localStorage.setItem("userName", decoded.fullname);
    localStorage.setItem("userEmail", decoded.email); 

     

    const res = await api.get(`http://localhost:3000/notifications/${userId}`);

    setNotifications(res.data);

  } catch (err) {
    console.error("Error fetching notifications", err);
  }
};

React.useEffect(() => {
  fetchNotifications();
}, []);

  // Dismiss individual notification
  const handleDismissNotification = async (id) => {

  try {

    await api.delete(`/api/notifications/${id}`);

    setNotifications((prev) =>
      prev.filter((notif) => notif._id !== id)
    );

  } catch (err) {
    console.error("Error deleting notification", err);
  }

};

  const handleBellClick = () => setShowNotifications(true);
  const handleDismiss = () => setShowNotifications(false);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      // ignore server errors
    } finally {
      localStorage.removeItem('token');
      localStorage.clear();
      toast({ title: 'Logged out', description: 'You have been logged out.' });
      navigate('/login');
    }
  };

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

                {/* Notification Bell and Popup */}
                <div className="relative">
                  <Button variant="ghost" size="icon" className="relative" onClick={handleBellClick} aria-label="Show notifications">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
                  </Button>
                  {showNotifications && (
                    <div
                      className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg"
                      style={{ zIndex: 9999, overflow: 'visible' }}
                    >
                      <div className="flex items-center justify-between px-4 py-2 border-b">
                        <span className="font-semibold text-lg">Notifications</span>
                        <button
                          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                          onClick={handleDismiss}
                          aria-label="Dismiss notifications"
                        >
                          ×
                        </button>
                      </div>
                      <ul className="max-h-60 overflow-y-auto" style={{ overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                          <li className="px-4 py-3 text-gray-500">No notifications</li>
                        ) : (
                          notifications.map((notif) => (
                            <li key={notif.id} className="px-4 py-3 border-b last:border-b-0 text-gray-700 flex justify-between items-center">
                              <span>{notif.message}</span>
                              <button
                                className="ml-2 text-gray-400 hover:text-red-500 text-lg font-bold"
                                onClick={() => handleDismissNotification(notif.id)}
                                aria-label="Dismiss notification"
                              >
                                ×
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  )}
                </div>

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
                    onClick={handleLogout}
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
