// src/pages/UploadProof.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/axios.js";
import "../css/paymentProof.css";

export default function UploadProof() {
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Safety check
  if (!transactionId) {
    return <p>Invalid transaction</p>;
  }

  const upload = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("paymentProof", file);

    try {
      setLoading(true);

      await api.patch(
        `/api/transactions/${transactionId}/payment-proof`,
        formData,
      );

      alert("Uploaded successfully!");

      // ✅ Redirect to history
      navigate("/my-transactions");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>Upload Payment Proof</h1>

        {/* File input */}
        <label className="file-label">
          {file ? file.name : "Choose payment proof image"}
          <input type="file" onChange={(e) => setFile(e.target.files![0])} />
        </label>

        {/* Upload button */}
        <button className="btn-upload" onClick={upload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}