import { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Navbar.css"; // for styles

export const Navbar = ({ user }: { user: any }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen(!open);

  const handleOutsideClick = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-title">Fluency App</div>
      {user && (
        <div className="profile-container" ref={menuRef}>
          <img
            src={user.photoURL || "/default-avatar.png"}
            alt="Profile"
            className="profile-pic"
            onClick={toggleMenu}
          />
          {open && (
            <div className="dropdown">
              <div className="dropdown-item"><strong>{user.displayName}</strong></div>
              <div className="dropdown-item">{user.email}</div>
              <hr />
              <button className="dropdown-item logout" onClick={() => signOut(auth)}>
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
