import { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

export const Navbar = ({
  user,
  onToggleSidebar
}: {
  user: any;
  onToggleSidebar: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="hamburger"
          onClick={() => {
            if (window.innerWidth <= 768) {
              document.body.classList.toggle("menu-open");
            } else {
              onToggleSidebar();
            }
          }}
        >
          ☰
        </button>
        <span className="navbar-title">Fluency App</span>
      </div>

      <div className="profile-container" ref={menuRef}>
        <img
          src={user.photoURL || "/default-avatar.png"}
          alt="Profile"
          className="profile-pic"
          onClick={toggleMenu}
        />
        {open && (
          <div className="dropdown">
            <div className="dropdown-item">{user.displayName}</div>
            <div className="dropdown-item">{user.email}</div>
            <hr />
            <Link to="/profile" className="dropdown-item">My Profile</Link>
            <button className="dropdown-item logout" onClick={() => signOut(auth)}>
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
