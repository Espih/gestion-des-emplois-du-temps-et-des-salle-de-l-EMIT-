// components/Layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ClassIcon from "@mui/icons-material/Class";
import SchoolIcon from "@mui/icons-material/School";
import BookIcon from "@mui/icons-material/Book";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonIcon from "@mui/icons-material/Person";

const menuItems = [
  { path: "/dashboard", name: "Dashboard", icon: DashboardIcon },
  { path: "/classes", name: "Classes", icon: ClassIcon },
  { path: "/enseignants", name: "Enseignants", icon: SchoolIcon },
  { path: "/matieres", name: "Matières", icon: BookIcon },
  { path: "/salles", name: "Salles", icon: MeetingRoomIcon },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#020339] text-white shadow-xl z-20">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-[#94CCFB]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#94CCFB] rounded-lg flex items-center justify-center">
              <span className="text-[#020339] text-xl font-bold">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">EMIT Planner</h1>
              <p className="text-xs text-[#94CCFB]">Administration</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-[#94CCFB] text-[#020339] font-semibold"
                          : "hover:bg-[#94CCFB]/10 text-gray-300 hover:text-white"
                      }`
                    }
                  >
                    <Icon className="text-xl" />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#94CCFB]/20">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#94CCFB]/10">
            <div className="w-8 h-8 bg-[#94CCFB] rounded-full flex items-center justify-center">
              <PersonIcon className="text-[#020339] text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Test</p>
              <p className="text-xs text-[#94CCFB]">admin@emit.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}