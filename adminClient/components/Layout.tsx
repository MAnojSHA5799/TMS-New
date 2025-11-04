"use client";
import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (fixed on the left) */}
      <div className="w-64 fixed top-0 left-0 h-full z-40">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Navbar (fixed on top) */}
        <div className="fixed top-0 left-64 right-0 z-40">
          <Navbar />
        </div>

        {/* Scrollable Page Content */}
        <main className="mt-[64px] overflow-y-auto h-[calc(100vh-64px)] bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
