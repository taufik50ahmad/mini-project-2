// src/pages/OrganizerTransactions.tsx
import { useEffect, useState } from "react";
import { api } from "../lib/axios.js";
import "../css/organizerApprove.css";

export default function OrganizerTransactions() {
  const [data, setData] = useState<any[]>([]);

  // 🔥 Image viewer state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  // ✅ Fetch data
  const fetchData = async () => {
    const res = await api.get("/api/organizer/transactions");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Fix stuck dragging
  useEffect(() => {
    const stopDragging = () => setDragging(false);
    window.addEventListener("mouseup", stopDragging);
    return () => window.removeEventListener("mouseup", stopDragging);
  }, []);

  // ✅ Accept / Reject
  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/api/transactions/${id}/status`, { status });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="trx-page">
      <div className="trx-container">
        <h1>Organizer Transactions</h1>

        {data.map((trx) => (
          <div key={trx.id} className="trx-card">
            {/* LEFT */}
            <div className="trx-info">
              <h3>{trx.event.title}</h3>
              <p>
                <strong>User:</strong> {trx.user.email}
              </p>
              <p>
                <strong>Qty:</strong> {trx.quantity}
              </p>
              <p>
                <strong>Total:</strong> {trx.totalPrice}
              </p>
              <p className={`status ${trx.status.toLowerCase()}`}>
                {trx.status}
              </p>

              {trx.status === "PENDING" && (
                <div className="btn-group">
                  <button
                    className="btn-accept"
                    onClick={() => updateStatus(trx.id, "ACCEPTED")}
                  >
                    Accept
                  </button>

                  <button
                    className="btn-reject"
                    onClick={() => updateStatus(trx.id, "REJECTED")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="trx-image">
              {trx.paymentProof ? (
                <img
                  src={trx.paymentProof}
                  alt="proof"
                  onClick={() => {
                    setSelectedImage(trx.paymentProof);
                    setZoom(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                />
              ) : (
                <p className="no-proof">No proof</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN VIEWER */}
      {selectedImage && (
        <div className="image-viewer" onClick={() => setSelectedImage(null)}>
          <img
            src={selectedImage}
            draggable={false}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => {
              if (zoom === 1) return;
              setDragging(true);
              setStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
              });
            }}
            onMouseMove={(e) => {
              if (!dragging) return;
              setPosition({
                x: e.clientX - start.x,
                y: e.clientY - start.y,
              });
            }}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onWheel={(e) => {
              e.preventDefault();
              setZoom((z) =>
                e.deltaY < 0 ? Math.min(5, z + 0.2) : Math.max(1, z - 0.2),
              );
            }}
            onDoubleClick={() => {
              if (zoom === 1) setZoom(2);
              else {
                setZoom(1);
                setPosition({ x: 0, y: 0 });
              }
            }}
            className="viewer-image"
            style={{
              transform: `
              translate(-50%, -50%)
              translate(${position.x}px, ${position.y}px)
              scale(${zoom})
            `,
            }}
          />

          {/* Controls */}
          <div className="viewer-controls" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setZoom((z) => Math.min(5, z + 0.2))}>
              +
            </button>
            <button onClick={() => setZoom((z) => Math.max(1, z - 0.2))}>
              -
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPosition({ x: 0, y: 0 });
              }}
            >
              Reset
            </button>
            <button onClick={() => setSelectedImage(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}