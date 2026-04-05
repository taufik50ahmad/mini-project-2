import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios.js";
import "../css/transactionHistory.css";

export default function MyTransactions() {
  const [data, setData] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const res = await api.get("/api/transactions/my");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mytrx-page">
      <div className="mytrx-container">
        <h1>My Transactions</h1>

        {data.length === 0 && <p className="empty">No transactions yet</p>}

        {data.map((trx) => (
          <div key={trx.id} className="mytrx-card">
            <div className="trx-info">
              <h3>{trx.event.title}</h3>

              <p className={`status ${trx.status.toLowerCase()}`}>
                {trx.status}
              </p>

              <p>
                <strong>Total:</strong> {trx.totalPrice}
              </p>
            </div>

            {/* Image */}
            {trx.paymentProof && (
              <img src={trx.paymentProof} alt="proof" className="trx-image" />
            )}

            {/* Action */}
            {trx.status === "PENDING" && !trx.paymentProof && (
              <button
                className="btn-upload"
                onClick={() => navigate(`/upload-payment/${trx.id}`)}
              >
                Upload Payment
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}