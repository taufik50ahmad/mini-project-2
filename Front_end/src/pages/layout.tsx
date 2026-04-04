import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Layout() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  // 🔐 Check login status
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

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    setName("");

    navigate("/login"); // 👈 better UX
    window.location.reload(); // quick refresh
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={{ width: "120px" }}></div>

        {/* LOGO */}
        <div style={styles.logo} onClick={() => navigate("/homepage")}>
          Event
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.auth}>
          {!isLoggedIn ? (
            <>
              <button onClick={() => navigate("/login")}>Sign In</button>
              <button onClick={() => navigate("/register")}>Sign Up</button>
            </>
          ) : (
            <>
              {role === "ORGANIZER" && (
                <button onClick={() => navigate("/organizer/transactions")}>
                  Dashboard
                </button>
              )}

              {role === "ORGANIZER" && (
                <button onClick={() => navigate("/organizer/transactions")}>
                  Create Event
                </button>
              )}

              {role === "ORGANIZER" && (
                <button onClick={() => navigate("/organizer/events")}>
                  Event Management
                </button>
              )}

              {role === "CUSTOMER" && (
                <button onClick={() => navigate("/my-transactions")}>
                  My Transactions
                </button>
              )}

              <button onClick={() => navigate("/profile")}>
                {name || "Profile"}
              </button>

              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <Outlet />
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    borderBottom: "1px solid #ddd",
  },
  logo: {
    fontSize: "26px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  auth: {
    display: "flex",
    gap: "10px",
  },
};
