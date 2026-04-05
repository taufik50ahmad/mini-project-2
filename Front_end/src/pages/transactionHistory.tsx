// src/pages/MyTransactions.tsx
import { useEffect, useState } from "react";
import { api } from "../lib/axios.js";
import UploadProof from "./paymentProof.tsx";

export default function MyTransactions() {
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    const res = await api.get("/api/transactions/my");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>My Transactions</h2>

      {data.map((trx) => (
        <div key={trx.id} style={{ border: "1px solid gray", margin: 10 }}>
          <h3>{trx.event.title}</h3>
          <p>Status: {trx.status}</p>
          <p>Total: {trx.totalPrice}</p>

          {trx.paymentProof && <img src={trx.paymentProof} width={150} />}

          {trx.status === "PENDING" && !trx.paymentProof && (
            <UploadProof />
          )}
        </div>
      ))}
    </div>
  );
}