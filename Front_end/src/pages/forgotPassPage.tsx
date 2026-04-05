import { useState } from "react";
import "../css/forgotPassPage.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        "http://localhost:8888/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Reset link sent to email!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <h1>Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleSubmit}>Send Reset Link</button>
      </div>
    </div>
  );
}