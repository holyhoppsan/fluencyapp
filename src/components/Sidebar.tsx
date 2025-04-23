import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export const Sidebar = () => {
  const location = useLocation();
  const [statsExpanded, setStatsExpanded] = useState(false);

  // Expand Stats submenu if any stats route is active
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
              <NavLink
                to="/stats/vocabulary"
                className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"}
              >
                Vocabulary
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/add" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Add Word
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Profile
        </NavLink>
      </nav>
    </aside>
  );
};
