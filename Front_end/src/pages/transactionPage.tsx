import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/axios.js";
import "../css/transactionPage.css";

export default function TransactionPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const id = Number(eventId);
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const [voucherCode, setVoucherCode] = useState("");
  const [usePoints, setUsePoints] = useState(false);

  // ✅ COUPON STATES
  const [coupons, setCoupons] = useState<any[]>([]);
  const [useCoupon, setUseCoupon] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<number | null>(null);

  // 🔥 Fetch event
  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${id}`);
        setEvent(res.data.data);
      } catch (err: any) {
        console.error(err.response?.data?.message);
      }
    };

    fetchEvent();
    fetchCoupons(); // ✅ also fetch coupons
  }, [id]);

  // 🔥 Fetch coupons
  const fetchCoupons = async () => {
    try {
      const res = await api.get("/api/users/coupons");
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Create transaction
  const handleBuy = async () => {
    try {
      // ⚠️ prevent invalid state
      if (useCoupon && !selectedCoupon) {
        alert("Please select a coupon");
        return;
      }

      const res = await api.post("/api/transactions", {
        eventId: id,
        quantity,
        couponId: useCoupon ? selectedCoupon : null, // ✅ FIX
        voucherCode: voucherCode || null,
        usePoints,
      });

      const transactionId = res.data.id;

      alert("Transaction created! Please upload payment proof.");

      navigate(`/upload-payment/${transactionId}`);
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  if (!event) return <div>Loading event...</div>;

  return (
    <div className="transaction-page">
      <div className="transaction-container">
        <h1>{event.title}</h1>

        <p className="price">Price: {event.price}</p>

        {/* Quantity */}
        <div className="input-group">
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        {/* Voucher */}
        <div className="input-group">
          <label>Voucher Code</label>
          <input
            placeholder="Optional"
            type="text"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
          />
        </div>

        {/* Points */}
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={usePoints}
              onChange={() => setUsePoints(!usePoints)}
            />
            Use Points
          </label>
        </div>

        {/* Coupon */}
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={useCoupon}
              onChange={() => {
                setUseCoupon(!useCoupon);
                if (useCoupon) setSelectedCoupon(null);
              }}
            />
            Use Coupon
          </label>
        </div>

        {useCoupon && (
          <div className="input-group">
            <label>Select Coupon</label>
            <select
              value={selectedCoupon || ""}
              onChange={(e) =>
                setSelectedCoupon(
                  e.target.value ? Number(e.target.value) : null,
                )
              }
            >
              <option value="">-- Select Coupon --</option>
              {coupons.map((c) => (
                <option key={c.id} value={c.id}>
                  Discount: {c.discountAmount}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Button */}
        <button className="btn-buy" onClick={handleBuy}>
          Buy Ticket
        </button>
      </div>
    </div>
  );
}