import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    try {
      const res = await fetch("http://localhost:8888/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          referralCode: form.referralCode || undefined,
        }),
      });

      const data = await res.json();

      // ✅ HANDLE VALIDATION ERRORS HERE
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

        alert(messages.join("\n") || data.message);
        return;
      }

      alert("Register success!");
      navigate("/login");
    } catch (err: any) {
      // console.error(err); // 🔥 IMPORTANT
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
      />

      {/* ✅ REFERRAL INPUT (improved) */}
      <input
        placeholder="Referral Code (optional)"
        onChange={(e) =>
          setForm({ ...form, referralCode: e.target.value.toUpperCase() })
        }
      />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
