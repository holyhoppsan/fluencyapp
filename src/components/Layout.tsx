import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import Home from "../routes/Home";
import Practice from "../routes/Practice";
import Profile from "../routes/Profile";
import AddWord from "../routes/AddWord";
import StatsLayout from "../routes/stats/StatsLayout";
import StatsProgress from "../routes/stats/StatsProgress";
import Vocabulary from "../routes/stats/Vocabulary";
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
            <Route path="/add" element={<AddWord />} />
            <Route path="/profile" element={<Profile />} />

            {/* 🔽 Nested stats routes */}
            <Route path="/stats" element={<StatsLayout />}>
              <Route index element={<Navigate to="progress" />} />
              <Route path="progress" element={<StatsProgress />} />
              <Route path="vocabulary" element={<Vocabulary />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
};
