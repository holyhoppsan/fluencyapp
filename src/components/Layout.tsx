import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import Home from "../routes/Home";
import Practice from "../routes/Practice";
import Stats from "../routes/Stats";
import Profile from "../routes/Profile";
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
            <Route path="/" element={<Home />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
