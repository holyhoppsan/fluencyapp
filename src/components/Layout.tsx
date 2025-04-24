import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import Home from "../routes/Home";
import Practice from "../routes/Practice";
import Profile from "../routes/Profile";
import Vocabulary from "../routes/Vocabulary";
import StatsLayout from "../routes/stats/StatsLayout";
import StatsProgress from "../routes/stats/StatsProgress";
import Maintenance from "../routes/Maintenance"; // ✅ New route
import "./Navbar.css";
import "./Layout.css";

export const Layout = ({ user }: { user: any }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-layout ${collapsed ? "collapsed" : ""}`}>
      <Navbar user={user} onToggleSidebar={() => setCollapsed((prev) => !prev)} />
      <div className="app-body">
        <Sidebar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/maintenance" element={<Maintenance />} /> {/* ✅ Added route */}

            <Route path="/stats" element={<StatsLayout />}>
              <Route index element={<Navigate to="progress" />} />
              <Route path="progress" element={<StatsProgress />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
};
