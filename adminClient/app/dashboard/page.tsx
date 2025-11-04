"use client";
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/apiClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaCar, FaUsers, FaTruck, FaClipboardList } from "react-icons/fa";

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery(["stats"], async () => {
    const [vehicles, drivers, fleets, audits] = await Promise.all([
      api.get("/vehicles"),
      api.get("/drivers"),
      api.get("/fleets"),
      api.get("/system-audit"),
    ]);
    return {
      vehicles: vehicles.data.length,
      drivers: drivers.data.length,
      fleets: fleets.data.length,
      audits: audits.data.length,
    };
  });

  if (isLoading)
    return (
      <Layout>
        <div className="text-center text-gray-500 mt-20 text-lg">
          Loading dashboard...
        </div>
      </Layout>
    );

  if (isError)
    return (
      <Layout>
        <div className="text-center text-red-500 mt-20 text-lg">
          Failed to load dashboard data.
        </div>
      </Layout>
    );

  const cards = [
    { title: "Vehicles", value: data?.vehicles || 0, icon: <FaCar size={24} />, color: "#CC375D" },
    { title: "Drivers", value: data?.drivers || 0, icon: <FaUsers size={24} />, color: "#E94A71" },
    { title: "Fleets", value: data?.fleets || 0, icon: <FaTruck size={24} />, color: "#F27C9C" },
    { title: "Audits", value: data?.audits || 0, icon: <FaClipboardList size={24} />, color: "#F5A6B8" },
  ];

  const barData = [
    { name: "Vehicles", value: data?.vehicles || 0 },
    { name: "Drivers", value: data?.drivers || 0 },
    { name: "Fleets", value: data?.fleets || 0 },
    { name: "Audits", value: data?.audits || 0 },
  ];

  const pieData = [
    { name: "Vehicles", value: data?.vehicles || 0 },
    { name: "Drivers", value: data?.drivers || 0 },
    { name: "Fleets", value: data?.fleets || 0 },
  ];

  const COLORS = ["#CC375D", "#E94A71", "#F27C9C", "#F5A6B8"];

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#CC375D]">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-700 text-lg font-semibold">{card.title}</div>
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: `${card.color}20`, color: card.color }}
              >
                {card.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-[#CC375D]">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-[#CC375D]">Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#CC375D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-[#CC375D]">Fleet Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
