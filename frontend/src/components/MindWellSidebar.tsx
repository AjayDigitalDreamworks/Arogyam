import { useState } from "react";
import {
  Home,
  MessageCircle,
  Calendar,
  BookOpen,
  Users,
  GamepadIcon,
  Heart,
  Moon,
  Dumbbell,
  Phone,
  Star,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainMenuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "AI Chatbot", url: "/chat", icon: MessageCircle },
  { title: "Book Appointment", url: "/appointments", icon: Calendar },
  { title: "Resource Hub", url: "/resources", icon: BookOpen },
  { title: "Community Forum", url: "/community", icon: Users },
];

const wellnessToolsItems = [
  { title: "Germs Game", url: "/game", icon: GamepadIcon },
  { title: "Mood Tracker", url: "/mood", icon: Heart },
  { title: "Sleep Tracker", url: "/sleep", icon: Moon },
  { title: "Exercise Plans", url: "/exercise", icon: Dumbbell },
];

const supportItems = [
  { title: "Crisis Helpline", url: "/crisis", icon: Phone },
  { title: "Review & Feedback", url: "/feedback", icon: Star },
];

export function MindWellSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) =>
    currentPath === path || (path !== "/" && currentPath.startsWith(path));

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium"
      : "text-muted-foreground hover:bg-primary/5 hover:text-primary";

  return (
    <Sidebar
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } border-r border-border bg-card`}
      collapsible="icon"
    >
      <SidebarContent className="p-4 flex flex-col">
        {/* Logo Section */}
        <div className="p-2">
          <div
            className={`flex ${
              isCollapsed ? "justify-center" : "items-center gap-3"
            }`}
          >
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-primary">MindWell</h1>
                <p className="text-xs text-muted-foreground">
                  Student Wellness
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Menu */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {!isCollapsed ? "MAIN MENU" : ""}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu
              className={`${isCollapsed ? "flex items-center" : "space-y-2"}`}
            >
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) => `
                        flex  items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                        ${getNavCls({ isActive })}
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Wellness Tools */}
        <SidebarGroup className="">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {!isCollapsed ? "WELLNESS TOOLS" : ""}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu
              className={`${isCollapsed ? "flex items-center" : "space-y-2"}`}
            >
              {wellnessToolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                        ${getNavCls({ isActive })}
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support */}
        <SidebarGroup className="">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {!isCollapsed ? "SUPPORT" : ""}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu
              className={`${isCollapsed ? "flex items-center" : "space-y-2"}`}
            >
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                        ${getNavCls({ isActive })}
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
