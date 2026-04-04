// src/pages/OrganizerTransactions.tsx
import { useEffect, useState } from "react";
import { api } from "../lib/axios.js";

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
    <div>
      <h2>Organizer Transactions</h2>

      {data.map((trx) => (
        <div
          key={trx.id}
          style={{
            display: "flex",
            gap: "20px",
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "15px",
            alignItems: "center",
          }}
        >
          {/* LEFT SIDE */}
          <div style={{ flex: 1 }}>
            <h3>{trx.event.title}</h3>
            <p>User: {trx.user.email}</p>
            <p>Qty: {trx.quantity}</p>
            <p>Total: {trx.totalPrice}</p>
            <p>Status: {trx.status}</p>

            {trx.status === "PENDING" && (
              <>
                <button onClick={() => updateStatus(trx.id, "ACCEPTED")}>
                  ✅ Accept
                </button>

                <button onClick={() => updateStatus(trx.id, "REJECTED")}>
                  ❌ Reject
                </button>
              </>
            )}
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div>
            {trx.paymentProof ? (
              <img
                src={trx.paymentProof}
                alt="proof"
                draggable={false}
                onClick={() => {
                  setSelectedImage(trx.paymentProof);
                  setZoom(1);
                  setPosition({ x: 0, y: 0 });
                }}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              />
            ) : (
              <p>No proof</p>
            )}
          </div>
        </div>
      ))}

      {/* 🔥 FULLSCREEN IMAGE VIEWER */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.9)",
            zIndex: 999,
            overflow: "hidden",
          }}
        >
          <img
            src={selectedImage}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
            // ✅ Start drag
            onMouseDown={(e) => {
              if (zoom === 1) return;
              setDragging(true);
              setStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
              });
            }}
            // ✅ Drag move
            onMouseMove={(e) => {
              if (!dragging) return;
              setPosition({
                x: e.clientX - start.x,
                y: e.clientY - start.y,
              });
            }}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            // 🔥 Scroll zoom
            onWheel={(e) => {
              e.preventDefault();
              setZoom((z) =>
                e.deltaY < 0 ? Math.min(5, z + 0.2) : Math.max(1, z - 0.2),
              );
            }}
            // 🔥 Double click zoom
            onDoubleClick={() => {
              if (zoom === 1) setZoom(2);
              else {
                setZoom(1);
                setPosition({ x: 0, y: 0 });
              }
            }}
            style={{
              cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `
                translate(-50%, -50%)
                translate(${position.x}px, ${position.y}px)
                scale(${zoom})
              `,
              transition: dragging ? "none" : "0.15s ease-out",
              userSelect: "none",
            }}
          />

          {/* 🔥 CONTROLS */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              bottom: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "10px",
              background: "rgba(0,0,0,0.6)",
              padding: "10px 20px",
              borderRadius: "10px",
            }}
          >
            <button onClick={() => setZoom((z) => Math.min(5, z + 0.2))}>
              ➕
            </button>

            <button onClick={() => setZoom((z) => Math.max(1, z - 0.2))}>
              ➖
            </button>

            <button
              onClick={() => {
                setZoom(1);
                setPosition({ x: 0, y: 0 });
              }}
            >
              🔄 Reset
            </button>

            <button onClick={() => setSelectedImage(null)}>❌</button>
          </div>
        </div>
      )}
    </div>
  );
}