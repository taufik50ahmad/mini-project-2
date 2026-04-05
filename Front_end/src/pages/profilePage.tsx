import { useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  role: string;
  refCode: string;
  profilePic: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [points, setPoints] = useState(0);
  const [coupons, setCoupons] = useState(0);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // ✅ cache-busting version
  const [imageVersion, setImageVersion] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
    fetchPoints();
    fetchCoupons();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch("http://localhost:8888/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("UPLOAD RESPONSE:", data);
    setUser(data.data);

    setEditName(data.data.name);
    setEditEmail(data.data.email);
  };

  const fetchPoints = async () => {
    const res = await fetch("http://localhost:8888/api/users/points", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setPoints(data.totalPoints || 0);
  };

  const fetchCoupons = async () => {
    const res = await fetch("http://localhost:8888/api/users/coupons", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setCoupons(data.coupons?.length || 0);
  };

  // ✏️ UPDATE PROFILE
  const handleUpdate = async () => {
    const body: any = {
      name: editName,
      email: editEmail,
    };

    // ✅ Only include password if user wants to change it
    if (showPasswordForm && newPassword) {
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      body.oldPassword = oldPassword;
      body.newPassword = newPassword;
    }

    const res = await fetch("http://localhost:8888/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body), // ✅ use the correct body
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Profile updated!");

    // ✅ clear password fields after success
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false);

    fetchProfile();
  };

  // 🖼️ UPLOAD PROFILE PIC
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const res = await fetch("http://localhost:8888/api/users/profile-picture", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      // ✅ bump version → forces image refresh
      setImageVersion((prev) => prev + 1);

      await fetchProfile();
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Profile</h1>

      {/* AVATAR */}
      <img
        src={
          user.profilePic
            ? `${user.profilePic}?v=${imageVersion}`
            : "https://via.placeholder.com/120"
        }
        alt="avatar"
        width={120}
        height={120}
        style={{ borderRadius: "50%", objectFit: "cover" }}
      />

      <input
        type="file"
        name="profilePicture"
        onChange={async (e) => {
          if (e.target.files) {
            await handleUpload(e.target.files[0]); // ✅ wait properly
          }
        }}
      />

      {/* INFO */}
      <div>
        <p>
          <b>Referral Code:</b> {user.refCode}
        </p>
        <p>
          <b>Points:</b> {points}
        </p>
        <p>
          <b>Coupons:</b> {coupons}
        </p>
      </div>

      {/* EDIT FORM */}
      <div style={{ marginTop: "20px" }}>
        <h3>Edit Profile</h3>

        <input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Name"
        />

        <input
          value={editEmail}
          onChange={(e) => setEditEmail(e.target.value)}
          placeholder="Email"
        />

        <p onClick={() => setShowPasswordForm((prev) => !prev)}>
          {showPasswordForm ? "Cancel Password Change" : "Change Password"}
        </p>

        {showPasswordForm && (
          <div style={{ marginTop: "10px" }}>
            <input
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Old Password"
              type="password"
            />

            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              type="password"
            />

            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              type="password"
            />
          </div>
        )}
        <button onClick={handleUpdate}>Save</button>
      </div>
    </div>
  );
}
