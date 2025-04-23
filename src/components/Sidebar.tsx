import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export const Sidebar = () => {
  const location = useLocation();
  const [statsExpanded, setStatsExpanded] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/stats")) {
      setStatsExpanded(true);
    }
  }, [location.pathname]);

  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/home" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Home
        </NavLink>

        <NavLink to="/practice" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Practice
        </NavLink>

        <NavLink to="/vocabulary" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Vocabulary
        </NavLink>

        <div className="nav-group">
          <div
            className={`nav-item nav-collapsible ${statsExpanded ? "expanded" : ""}`}
            onClick={() => setStatsExpanded(!statsExpanded)}
          >
            Stats ▾
          </div>
          {statsExpanded && (
            <div className="nav-submenu">
              <NavLink
                to="/stats/progress"
                className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"}
              >
                Your Progress
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Profile
        </NavLink>
      </nav>
    </aside>
  );
};
