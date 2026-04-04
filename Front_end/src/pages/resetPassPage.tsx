import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ NEW
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const handleReset = async () => {
    try {
      const res = await fetch("http://localhost:8888/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
          confirmPassword: confirmPassword, // ✅ SEND THIS
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
          messages.push(...(data.errors.formErrors as string[]));
        }

        alert(messages.join("\n") || data.message);
        return;
      }

      alert("Password reset successful!");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>

      {/* ✅ New Password */}
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* ✅ Confirm Password */}
      <input
        type="password"
        placeholder="Confirm Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
}