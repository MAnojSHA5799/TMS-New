"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Users", path: "/users" },
  { name: "Fleets", path: "/fleets" },
  { name: "Vehicles", path: "/vehicles" },
  { name: "Drivers", path: "/drivers" },
  { name: "Routes", path: "/routes" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg h-screen p-4 flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-6 border-b pb-4">
        <Image
          src="/logo.png" // place your logo inside the "public" folder
          alt="Company Logo"
          width={40}
          height={40}
          className="mr-2"
        />
        <h1 className="text-xl font-bold text-[#CC375D]">Fleet System</h1>
      </div>

      {/* Menu Section */}
      <nav className="space-y-2 flex-1">
        {menu.map((item) => (
          <Link key={item.path} href={item.path}>
            <div
              className={`p-2 rounded cursor-pointer transition ${
                pathname === item.path
                  ? "bg-[#CC375D] text-white font-semibold"
                  : "hover:bg-[#CC375D]/10 text-gray-700"
              }`}
            >
              {item.name}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
