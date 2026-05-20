// routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import Dashboard from "../pages/dashboard";
import Classes from "../pages/Classes";
import Enseignants from "../pages/Enseignants";
import Matieres from "../pages/Matieres";
import Salles from "../pages/Salles";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/enseignants" element={<Enseignants />} />
          <Route path="/matieres" element={<Matieres />} />
          <Route path="/salles" element={<Salles />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}