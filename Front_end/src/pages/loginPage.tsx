import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./loginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔐 Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8888/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // ✅ Store auth
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("name", data.data.name);
      localStorage.setItem("role", data.data.role);

      navigate("/homepage");
      window.location.reload(); // quick fix for navbar
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Sign In</h2>

        {/* ERROR */}
        {error && <p style={styles.error}>{error}</p>}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        {/* PASSWORD + SHOW/HIDE */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eye}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        {/* BUTTON */}
        <button onClick={handleLogin} disabled={loading} style={styles.button}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* NAVIGATION */}
        <p style={{ marginTop: "10px" }}>
          Don't have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/register")}>
            Sign Up
          </span>
        </p>
        <p onClick={() => navigate("/forgot-password")}>Forgot Password ?</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  card: {
    border: "1px solid #ddd",
    padding: "30px",
    borderRadius: "10px",
    width: "320px",
    textAlign: "center" as const,
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  link: {
    color: "blue",
    cursor: "pointer",
  },
  eye: {
    position: "absolute" as const,
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
  },
};