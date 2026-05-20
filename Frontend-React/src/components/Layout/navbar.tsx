// components/Layout/Navbar.tsx
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Badge, IconButton, InputBase, Paper } from "@mui/material";

export default function Navbar() {
  const [notifications] = useState(3);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Titre de la page */}
        <div>
          <h2 className="text-2xl font-bold text-[#020339]">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Bienvenue, Andrew Bennett</p>
        </div>

        {/* Actions droite */}
        <div className="flex items-center gap-4">
          {/* Recherche */}
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 250,
              boxShadow: "none",
              border: "1px solid #e5e7eb",
            }}
          >
            <IconButton sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Rechercher..."
              inputProps={{ "aria-label": "search" }}
            />
          </Paper>

          {/* Notifications */}
          <IconButton>
            <Badge badgeContent={notifications} color="error">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          {/* Profile */}
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-[#020339] to-[#94CCFB] rounded-full flex items-center justify-center text-white text-sm font-bold">
              AB
            </div>
            <span className="text-sm font-medium text-gray-700">Test</span>
            <KeyboardArrowDownIcon className="text-gray-400 text-sm" />
          </div>
        </div>
      </div>
    </nav>
  );
}