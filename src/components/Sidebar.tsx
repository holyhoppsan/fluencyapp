import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/home" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Home
        </NavLink>
        <NavLink to="/practice" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Practice
        </NavLink>
        <NavLink to="/stats" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Stats
        </NavLink>
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
