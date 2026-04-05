import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/registerPage.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8888/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
          referralCode: form.referralCode || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        let messages: string[] = [];

        if (data.errors?.fieldErrors) {
          messages.push(
            ...(Object.values(data.errors.fieldErrors).flat() as string[]),
          );
        }
        if (data.errors?.formErrors) {
          messages.push(...data.errors.formErrors);
        }

        alert(messages.join("\n") || data.message || "Registration failed");
        return;
      }

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Create Account</h1>

        <div className="form-group">
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <input
            placeholder="Referral Code (optional)"
            value={form.referralCode}
            onChange={(e) =>
              setForm({ ...form, referralCode: e.target.value.toUpperCase() })
            }
            maxLength={10}
          />
        </div>

        <button className="register-btn" onClick={handleRegister}>
          Register
        </button>

        <div className="login-link">
          Already have an account?{" "}
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Login here
          </a>
        </div>
      </div>
    </div>
  );
}