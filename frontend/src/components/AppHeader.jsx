import React from "react";
import { Bell, MessageCircle, ChevronDown, Search, Heart } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="bg-white w-full flex items-center justify-between border-b border-gray-200 shadow-sm">
      {/* Left: Logo and Product Name */}
      <div className="flex items-center ">
        {/* Logo Section */}
        <div className="p-2">
          <div className="items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-primary">Arogyam</h1>
              <p className="text-xs text-muted-foreground">Student Wellness</p>
            </div>
          </div>
        </div>
        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <a
            href="#"
            className="px-4 py-1 rounded-lg bg-violet-100 text-violet-600 font-medium shadow"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-violet-600 font-medium"
          >
            Resources
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-violet-600 font-medium"
          >
            Community
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-violet-600 font-medium"
          >
            Appointments
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-violet-600 font-medium"
          >
            Support
          </a>
        </nav>
      </div>
      {/* Middle: Search Bar */}
      <div className=" flex justify-center">
        <div className="relative w-[330px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search resources, articles"
            className="pl-12 pr-4 py-2 rounded-lg border border-gray-200 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </div>
      {/* Right: Notifications, Profile */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </div>
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-gray-500 ml-1" />
          <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-green-400 rounded-full"></span>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg" // Replace with real user photo/Avatar component
            alt="Sarah Chen"
            className="w-8 h-8 rounded-full object-cover border border-gray-300"
          />
          <div className="text-right leading-tight mr-1">
            <div className="text-sm font-semibold text-gray-800">Sarah</div>
            <div className="text-xs text-gray-500">
              Chen
              <br />
              Computer Science
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
