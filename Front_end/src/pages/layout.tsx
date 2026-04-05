import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Layout.css"; 

export default function Layout() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setName(storedName || "");
      setRole(storedRole || "");
    } else {
      setIsLoggedIn(false);
      setName("");
      setRole("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setName("");
    navigate("/login");
  };

  return (
    <div className="layout">
      {/* NAVBAR - Dark Theme */}
      <nav className="navbar">
        <div className="nav-content">
          {/* Logo */}
          <div className="logo" onClick={() => navigate("/homepage")}>
            Event
          </div>

          {/* Right Side Buttons */}
          <div className="nav-auth">
            {!isLoggedIn ? (
              <>
                <button className="nav-btn" onClick={() => navigate("/login")}>
                  Sign In
                </button>
                <button className="nav-btn register" onClick={() => navigate("/register")}>
                  Sign Up
                </button>
              </>
            ) : (
              <>
                {role === "ORGANIZER" && (
                  <>
                    <button className="nav-btn" onClick={() => navigate("/organizer/transactions")}>
                      Dashboard
                    </button>
                    <button className="nav-btn" onClick={() => navigate("/organizer/events")}>
                      Event Management
                    </button>
                  </>
                )}

                {role === "CUSTOMER" && (
                  <button className="nav-btn" onClick={() => navigate("/my-transactions")}>
                    My Transactions
                  </button>
                )}

                <button className="nav-btn" onClick={() => navigate("/profile")}>
                  {name || "Profile"}
                </button>

                <button className="nav-btn logout" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <Outlet />
    </div>
  );
}